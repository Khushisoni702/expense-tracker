import React, { useEffect, useState, useRef } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-toastify';
import Chart from 'chart.js/auto';

const ExportData = ({ selectedDate, refreshFlag }) => {
  const [transactions, setTransactions] = useState([]);
  const [chartsReady, setChartsReady] = useState(false);
  const barRef = useRef(null);
  const pieRef = useRef(null);
  const barChartInstance = useRef(null);
  const pieChartInstance = useRef(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);

      const q = query(
        collection(db, 'transactions'),
        where('uid', '==', user.uid),
        where('created', '>=', start),
        where('created', '<=', end)
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setTransactions(data);
    };

    fetchTransactions();
  }, [selectedDate, refreshFlag]);

  useEffect(() => {
    if (!barRef.current || !pieRef.current) return;

    const income = transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    // Destroy old charts if exist
    barChartInstance.current?.destroy();
    pieChartInstance.current?.destroy();

    // Create Bar Chart
    barChartInstance.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          label: 'Amount',
          data: [income, expense],
          backgroundColor: ['#4CAF50', '#F44336'],
        }]
      },
      options: {
        responsive: false,
        animation: {
          onComplete: () => setChartsReady(true)
        }
      }
    });

    // Create Pie Chart
    pieChartInstance.current = new Chart(pieRef.current, {
      type: 'pie',
      data: {
        labels: ['Income', 'Expense'],
        datasets: [{
          data: [income, expense],
          backgroundColor: ['#2196F3', '#FF9800'],
        }]
      },
      options: {
        responsive: false
      }
    });
  }, [transactions]);

  const formatDate = (created) => {
    if (created?.toDate) {
      return format(created.toDate(), 'dd/MM/yyyy');
    } else if (created instanceof Date) {
      return format(created, 'dd/MM/yyyy');
    } else {
      return '';
    }
  };

  const exportToCSV = () => {
    if (!transactions.length) {
      toast.warning("No data to export");
      return;
    }

    const csvContent = [
      ['Type', 'Amount', 'Category', 'Date'],
      ...transactions.map(tx => [
        tx.type,
        tx.amount,
        tx.category,
        formatDate(tx.created),
      ])
    ]
      .map(e => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported successfully");
  };

  const exportToPDF = () => {
    if (!transactions.length) {
      toast.warning("No data to export");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.text('Expense Tracker Report', 14, 16);

      autoTable(doc, {
        startY: 22,
        head: [['Type', 'Amount', 'Category', 'Date']],
        body: transactions.map(tx => [
          tx.type,
          tx.amount,
          tx.category,
          formatDate(tx.created),
        ]),
      });

      let finalY = doc.lastAutoTable.finalY + 10;

      if (barRef.current && pieRef.current) {
        const barImg = barRef.current.toDataURL('image/png');
        const pieImg = pieRef.current.toDataURL('image/png');

        doc.text('Bar Chart', 14, finalY + 5);
        doc.addImage(barImg, 'PNG', 14, finalY + 10, 180, 60);

        doc.text('Pie Chart', 14, finalY + 80);
        doc.addImage(pieImg, 'PNG', 14, finalY + 85, 100, 60);
      }

      doc.save('transactions.pdf');
      toast.success("PDF exported successfully");
    } catch (error) {
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          onClick={exportToCSV}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>

        <button
          onClick={exportToPDF}
          disabled={!chartsReady}
          className={`${
            chartsReady ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-400 cursor-not-allowed'
          } text-white px-4 py-2 rounded flex items-center gap-2`}
        >
          <Download className="w-4 h-4" />
          Export to PDF
        </button>
      </div>

      {/* Hidden canvases for PDF export */}
      <div className="hidden">
        <canvas ref={barRef} width={400} height={200} />
        <canvas ref={pieRef} width={300} height={200} />
      </div>
    </>
  );
};

export default ExportData;






