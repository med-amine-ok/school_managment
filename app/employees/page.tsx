'use client';

import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  DollarSign,
  UserCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { mockEmployees } from '@/data/employees';
import { formatCurrency } from '@/lib/calculations/financial';
import { schoolService } from '@/lib/services/schoolService';
import { Employee, EmployeeRole } from '@/types/employee';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([...mockEmployees]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Administration' as EmployeeRole,
    phone: '+213 55',
    email: '',
    salary: '55000',
    notes: 'Full-time institutional staff member',
  });

  const roles = Array.from(new Set(mockEmployees.map((e) => e.role)));

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employeeIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.includes(searchQuery);

      const matchesRole = roleFilter === 'All' || emp.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [employees, searchQuery, roleFilter]);

  const totalPayroll = employees
    .filter((e) => e.status === 'Active')
    .reduce((acc, e) => acc + e.salary, 0);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newEmp = await schoolService.createEmployee({
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@elnadjah-school.dz`,
      salary: parseFloat(formData.salary) || 55000,
      paymentSchedule: 'Monthly',
      status: 'Active',
      notes: formData.notes,
    });

    setEmployees((prev) => [newEmp, ...prev]);
    setIsAddModalOpen(false);
    setSuccessToast(`Staff member ${newEmp.name} registered with ${formatCurrency(newEmp.salary)} monthly salary.`);
    setTimeout(() => setSuccessToast(null), 3000);
    setFormData({
      name: '',
      role: 'Administration',
      phone: '+213 55',
      email: '',
      salary: '55000',
      notes: 'Full-time institutional staff member',
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Administrative & Operational Staff"
        subtitle={`Managing ${employees.length} full-time staff members — Monthly payroll: ${formatCurrency(totalPayroll)}`}
        breadcrumbs={[{ label: 'People' }, { label: 'Employees' }]}
        badge={
          <Badge variant="primary" size="md">
            {filteredEmployees.length} Staff Members
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Staff Member
          </Button>
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

      {/* Filter and Search */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by staff member name, ID number, or phone..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#64748B]" />
            <span className="text-xs text-[#64748B]">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white font-medium text-[#1E293B]"
            >
              <option value="All">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Staff Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role / Department</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Hire Date</th>
                <th className="py-3.5 px-4">Monthly Salary</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} role="Staff" size="md" />
                      <div>
                        <p className="font-bold text-[#1E293B]">{emp.name}</p>
                        <span className="text-[11px] font-mono text-[#94A3B8]">
                          {emp.employeeIdNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="primary" size="sm">
                      {emp.role}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="text-xs font-medium text-[#1E293B]">{emp.phone}</p>
                    <p className="text-[11px] text-[#64748B]">{emp.email}</p>
                  </td>

                  <td className="py-3.5 px-4 text-[#1E293B]">{emp.hireDate}</td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs font-bold text-[#15803D]">
                      {formatCurrency(emp.salary)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-[#64748B]">{emp.paymentSchedule}</td>

                  <td className="py-3.5 px-4">
                    <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'} size="sm">
                      {emp.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-[#64748B] max-w-[200px] truncate">
                    {emp.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Staff Member"
        subtitle="Register administrative or facility personnel and set their monthly salary"
        size="md"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Samira Benali"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Department Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as EmployeeRole })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="Administration">Administration</option>
                <option value="Accounting & Finance">Accounting & Finance</option>
                <option value="Reception & Registrar">Reception & Registrar</option>
                <option value="IT & Technical Support">IT & Technical Support</option>
                <option value="Security & Guarding">Security & Guarding</option>
                <option value="Maintenance & Facilities">Maintenance & Facilities</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Monthly Salary (DZD) *
            </label>
            <input
              type="number"
              required
              min="25000"
              step="1000"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Notes
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
            />
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
              Register Staff
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
