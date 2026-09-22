'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Clock,
  ExternalLink,
  Phone,
  Mail,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Key,
} from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { mockTeachers } from '@/data/teachers';
import { mockGroups } from '@/data/groups';
import { mockSubjects } from '@/data/subjects';
import { mockEnrollments } from '@/data/enrollments';
import { formatCurrency } from '@/lib/calculations/financial';
import { schoolService } from '@/lib/services/schoolService';
import { Teacher } from '@/types/teacher';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([...mockTeachers]);
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const { registerAccount } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Mathematics & Calculus',
    phone: '+213 55',
    email: '',
    username: '',
    password: 'teacher123',
    address: 'Alger, Algérie',
    salary: '75000',
  });

  // Enrich teachers with relational counts
  const enrichedTeachers = useMemo(() => {
    return teachers.map((teacher) => {
      const groups = mockGroups.filter((g) => g.teacherId === teacher.id && g.status === 'Active');
      const groupIds = groups.map((g) => g.id);

      // Student count
      const enrolledStudentsCount = mockEnrollments.filter(
        (e) => groupIds.includes(e.groupId) && e.status === 'Active'
      ).length;

      // Weekly hours
      const totalWeeklyMinutes = groups.reduce((acc, g) => {
        return acc + g.scheduleSlots.length * 90;
      }, 0);
      const weeklyHours = (totalWeeklyMinutes / 60).toFixed(1);

      // Monthly fixed salary
      const salary = teacher.salary || teacher.baseSalary || 75000;

      // Subjects taught
      const subjectIds = Array.from(new Set(groups.map((g) => g.subjectId)));
      const subjects = mockSubjects.filter((s) => subjectIds.includes(s.id));

      return {
        ...teacher,
        salary,
        groupsCount: groups.length,
        enrolledStudentsCount,
        weeklyHours,
        subjects,
      };
    });
  }, [teachers]);

  const specializations = Array.from(
    new Set(mockTeachers.map((t) => t.specialization.split('&')[0].trim()))
  );

  const filteredTeachers = useMemo(() => {
    return enrichedTeachers.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.teacherIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.specialization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpec =
        specializationFilter === 'All' || t.specialization.includes(specializationFilter);

      return matchesSearch && matchesSpec;
    });
  }, [enrichedTeachers, searchQuery, specializationFilter]);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const finalUsername =
      formData.username.trim() || formData.name.toLowerCase().replace(/\s+/g, '.');
    const finalPassword = formData.password.trim() || 'teacher123';
    const finalEmail =
      formData.email.trim() || `${finalUsername}@elnadjah-school.dz`;

    const newTeacher = await schoolService.createTeacher({
      name: formData.name,
      phone: formData.phone,
      email: finalEmail,
      username: finalUsername,
      password: finalPassword,
      address: formData.address,
      dateOfBirth: '1988-01-01',
      specialization: formData.specialization,
      status: 'Active',
      salary: parseFloat(formData.salary) || 75000,
      notes: 'Newly onboarded faculty member.',
    });

    // Register user account in AuthContext
    registerAccount({
      id: newTeacher.id,
      name: newTeacher.name,
      username: finalUsername,
      password: finalPassword,
      email: finalEmail,
      role: 'TEACHER',
      title: `${newTeacher.specialization} Instructor`,
      teacherId: newTeacher.id,
    });

    setTeachers((prev) => [newTeacher, ...prev]);
    setIsAddModalOpen(false);
    setSuccessToast(
      `Teacher ${newTeacher.name} registered! Portal Username: "${finalUsername}" | Password: "${finalPassword}"`
    );
    setTimeout(() => setSuccessToast(null), 6000);
    setFormData({
      name: '',
      specialization: 'Mathematics & Calculus',
      phone: '+213 55',
      email: '',
      username: '',
      password: 'teacher123',
      address: 'Alger, Algérie',
      salary: '75000',
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Faculty & Teachers Directory"
        subtitle={`Managing ${teachers.length} specialized instructors across secondary and middle tracks`}
        breadcrumbs={[{ label: 'People' }, { label: 'Teachers' }]}
        badge={
          <Badge variant="primary" size="md">
            {filteredTeachers.length} Faculty Members
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Teacher
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

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search faculty by name, ID number, or academic discipline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F6EF7] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]"
            >
              <option value="All">All Disciplines</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Teachers Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Teacher</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Specialization</th>
                <th className="py-3.5 px-4">Subjects & Groups</th>
                <th className="py-3.5 px-4">Students</th>
                <th className="py-3.5 px-4">Weekly Load</th>
                <th className="py-3.5 px-4">Monthly Salary</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredTeachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                  onClick={() => (window.location.href = `/teachers/${teacher.id}`)}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={teacher.name} role="Teacher" size="md" />
                      <div>
                        <p className="font-bold text-[#1E293B] group-hover:text-[#4F6EF7] transition-colors">
                          {teacher.name}
                        </p>
                        <span className="text-[11px] font-mono text-[#94A3B8]">
                          {teacher.teacherIdNumber}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-[#1E293B]">
                        <Phone className="w-3.5 h-3.5 text-[#64748B]" />
                        <span>{teacher.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                        <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                        <span>{teacher.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#1E293B]">
                    {teacher.specialization}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap max-w-[180px]">
                      {teacher.subjects.map((sub) => (
                        <span
                          key={sub.id}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: sub.color }}
                        >
                          {sub.name}
                        </span>
                      ))}
                      <span className="text-[11px] text-[#64748B]">
                        ({teacher.groupsCount} groups)
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#1E293B]">{teacher.enrolledStudentsCount}</span>
                    <span className="text-[11px] text-[#94A3B8] ml-1">students</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-xs font-medium text-[#1E293B]">
                      <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>{teacher.weeklyHours}h / week</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs font-bold text-[#15803D]">
                      {formatCurrency(teacher.salary)}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] block">
                      Fixed Monthly Salary
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={teacher.status === 'Active' ? 'success' : 'neutral'} size="sm">
                      {teacher.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={`/teachers/${teacher.id}`}
                      className="p-1.5 text-[#64748B] hover:text-[#4F6EF7] hover:bg-[#EEF2FF] rounded-lg transition-colors inline-block"
                      title="View instructor dossier"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Faculty Member"
        subtitle="Register a new teacher and establish their fixed monthly compensation"
        size="md"
      >
        <form onSubmit={handleCreateTeacher} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Youcef Belkacem"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Specialization / Subject *
              </label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="Mathematics & Calculus">Mathematics & Calculus</option>
                <option value="Physics & Applied Mechanics">Physics & Applied Mechanics</option>
                <option value="Natural Sciences & Biology">Natural Sciences & Biology</option>
                <option value="Chemistry & Thermodynamics">Chemistry & Thermodynamics</option>
                <option value="English Literature & IELTS Prep">English Literature</option>
                <option value="French Language & Literature">French Language</option>
                <option value="Arabic Literature & Rhetoric">Arabic Literature</option>
                <option value="Computer Science & Python">Computer Science & Python</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Fixed Monthly Salary (DZD) *
            </label>
            <input
              type="number"
              required
              min="30000"
              step="1000"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
            />
            <span className="text-[11px] text-[#64748B] mt-1 block">
              Direct monthly salary paid to the instructor regardless of session variances.
            </span>
          </div>

          {/* Login Credentials Section */}
          <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#4F6EF7]" /> Portal Login Credentials
              </span>
              <Badge variant="info" size="sm">Teacher Portal Access</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    formData.name
                      ? formData.name.toLowerCase().replace(/\s+/g, '.')
                      : 'e.g. rachid.daoud'
                  }
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                  Password *
                </label>
                <input
                  type="text"
                  required
                  placeholder="teacher123"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white font-mono"
                />
              </div>
            </div>
            <p className="text-[10px] text-[#64748B]">
              The teacher can use this username and password to log in at <span className="font-mono text-[#4F6EF7]">/login</span> and access their teaching schedule and attendance registers.
            </p>
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
              Register Teacher
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
