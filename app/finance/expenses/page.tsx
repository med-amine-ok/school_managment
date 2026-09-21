'use client';

import React, { useState, useMemo } from 'react';
import { Receipt, Plus, Search, Filter, Download, DollarSign, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { mockExpenses } from '@/data/expenses';
import { formatCurrency } from '@/lib/calculations/financial';
import { schoolService } from '@/lib/services/schoolService';
import { Expense, ExpenseCategory } from '@/types/finance';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([...mockExpenses]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Supplies' as ExpenseCategory,
    amount: '15000',
    vendor: '',
    paymentMethod: 'Bank Transfer' as 'Bank Transfer' | 'Cash' | 'Cheque',
    notes: 'Approved operational disbursement',
  });

  const categories = Array.from(new Set(mockExpenses.map((e) => e.category)));

  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch =
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.notes && exp.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = categoryFilter === 'All' || exp.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [expenses, searchQuery, categoryFilter]);

  const totalMonthlyExpenses = expenses
    .filter((e) => e.status === 'Paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const newExp = await schoolService.recordExpense({
      title: formData.title,
      category: formData.category,
      amount: parseFloat(formData.amount) || 15000,
      date: new Date().toISOString().split('T')[0],
      referenceNumber: `EXP-2026-${(expenses.length + 101).toString().padStart(4, '0')}`,
      paymentMethod: formData.paymentMethod,
      status: 'Paid',
      notes: formData.notes || `Disbursed to ${formData.vendor || 'vendor'}`,
    });

    setExpenses((prev) => [newExp, ...prev]);
    setIsAddModalOpen(false);
    setSuccessToast(`Expense "${newExp.title}" recorded for ${formatCurrency(newExp.amount)}.`);
    setTimeout(() => setSuccessToast(null), 3000);
    setFormData({
      title: '',
      category: 'Supplies',
      amount: '15000',
      vendor: '',
      paymentMethod: 'Bank Transfer',
      notes: 'Approved operational disbursement',
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="School Operating Expenses"
        subtitle={`Audit of institutional costs, leases, utilities, and vendor payouts in Algerian Dinars`}
        breadcrumbs={[{ label: 'Finance' }, { label: 'Expenses' }]}
        badge={
          <Badge variant="primary" size="md">
            Total Disbursed: {formatCurrency(totalMonthlyExpenses)}
          </Badge>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={() => alert('Expenses ledger exported.')}
            >
              Export Ledger
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Record Expense
            </Button>
          </>
        }
      />

      {successToast && (
        <div className="mb-6 p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-[#15803D]">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successToast}</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by expense description, reference number, or vendor..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-xs text-[#64748B]">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white font-medium text-[#1E293B]"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Ref #</th>
                <th className="py-3.5 px-4">Expense Title / Vendor</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount (DZD)</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#64748B]">
                    {exp.referenceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#1E293B]">{exp.title}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="neutral" size="sm">
                      {exp.category}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B]">{exp.date}</td>
                  <td className="py-3.5 px-4 font-bold text-[#DC2626]">
                    {formatCurrency(exp.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B]">{exp.paymentMethod}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success" size="sm">
                      {exp.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-[#64748B] max-w-[220px] truncate">
                    {exp.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Operating Expense"
        subtitle="Log operational costs, building utilities, supplies, or vendor invoices"
        size="md"
      >
        <form onSubmit={handleRecordExpense} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Expense Title / Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Science Lab glassware and reagent supplies"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="Rent">Facility Lease / Rent</option>
                <option value="Utilities">Utilities (Electricity, Water, Internet)</option>
                <option value="Maintenance">Maintenance & Cleaning</option>
                <option value="Supplies">Educational Supplies</option>
                <option value="Equipment">Lab & IT Equipment</option>
                <option value="Technology">Software Subscriptions</option>
                <option value="Marketing">Marketing & Print</option>
                <option value="Administrative">Administrative Costs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Amount (DZD) *
              </label>
              <input
                type="number"
                required
                min="500"
                step="500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Payment Channel *
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="Bank Transfer">Bank Transfer (Virement)</option>
                <option value="Cash">Cash (Caisse)</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Vendor / Payee
              </label>
              <input
                type="text"
                placeholder="e.g. SARL Laboratoires Algerie"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#F1F5F9]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              Record Expense
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
