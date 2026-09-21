'use client';

import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Search, DollarSign, Users, Layers, CheckCircle2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { mockSubjects } from '@/data/subjects';
import { mockGroups } from '@/data/groups';
import { mockEnrollments } from '@/data/enrollments';
import { formatCurrency } from '@/lib/calculations/financial';
import { schoolService } from '@/lib/services/schoolService';
import { Subject } from '@/types/subject';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([...mockSubjects]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'Scientific' as 'Scientific' | 'Literary' | 'Languages' | 'Technical',
    monthlyPrice: '3000',
    durationMinutes: '90',
    color: '#4F6EF7',
    description: '',
  });

  const enrichedSubjects = useMemo(() => {
    return subjects.map((subject) => {
      const groups = mockGroups.filter((g) => g.subjectId === subject.id);
      const groupIds = groups.map((g) => g.id);

      const enrolledStudentsCount = mockEnrollments.filter(
        (e) => groupIds.includes(e.groupId) && e.status === 'Active'
      ).length;

      const monthlyRevenue = enrolledStudentsCount * subject.monthlyPrice;

      return {
        ...subject,
        groupsCount: groups.length,
        enrolledStudentsCount,
        monthlyRevenue,
      };
    });
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    return enrichedSubjects.filter((s) => {
      return (
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [enrichedSubjects, searchQuery]);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const newSubject = await schoolService.createSubject({
      name: formData.name,
      code: formData.code.toUpperCase(),
      category: formData.category,
      monthlyPrice: parseFloat(formData.monthlyPrice) || 3000,
      durationMinutes: parseInt(formData.durationMinutes) || 90,
      color: formData.color,
      description: formData.description || `${formData.name} curriculum for secondary students`,
      status: 'Active',
    });

    setSubjects((prev) => [...prev, newSubject]);
    setIsAddModalOpen(false);
    setSuccessToast(`Subject "${newSubject.name}" created successfully with monthly fee ${formatCurrency(newSubject.monthlyPrice)}.`);
    setTimeout(() => setSuccessToast(null), 3000);
    setFormData({
      name: '',
      code: '',
      category: 'Scientific',
      monthlyPrice: '3000',
      durationMinutes: '90',
      color: '#4F6EF7',
      description: '',
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Academic Subjects & Curricula"
        subtitle={`Managing ${subjects.length} accredited subjects across scientific, literary, and technical tracks`}
        breadcrumbs={[{ label: 'Academic' }, { label: 'Subjects' }]}
        badge={
          <Badge variant="primary" size="md">
            {filteredSubjects.length} Courses
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Create Subject
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

      {/* Search Filter */}
      <Card className="p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject name, code, or curriculum track..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20 focus:border-[#4F6EF7]"
          />
        </div>
      </Card>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="p-6 border-t-4 flex flex-col justify-between" style={{ borderTopColor: subject.color }}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded">
                  {subject.code}
                </span>
                <Badge variant="primary" size="sm">
                  {subject.category}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-[#1E293B]">{subject.name}</h3>
              <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
                {subject.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                <div>
                  <span className="text-[10px] text-[#94A3B8] uppercase block">Groups</span>
                  <span className="text-sm font-bold text-[#1E293B] mt-0.5 block">
                    {subject.groupsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] uppercase block">Students</span>
                  <span className="text-sm font-bold text-[#1E293B] mt-0.5 block">
                    {subject.enrolledStudentsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] uppercase block">Duration</span>
                  <span className="text-sm font-bold text-[#1E293B] mt-0.5 block">
                    {subject.durationMinutes}m
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#64748B] block">Tuition / Student</span>
                <span className="text-sm font-bold text-[#1E293B]">
                  {formatCurrency(subject.monthlyPrice)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#15803D] block">Monthly Yield</span>
                <span className="text-sm font-extrabold text-[#15803D]">
                  {formatCurrency(subject.monthlyRevenue)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Subject Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Subject"
        subtitle="Define academic discipline, pricing in DZD, and theme identifier"
        size="md"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Philosophy & Ethics"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Subject Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. PHI-301"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none uppercase font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none bg-white"
              >
                <option value="Scientific">Scientific</option>
                <option value="Literary">Literary</option>
                <option value="Languages">Languages</option>
                <option value="Technical">Technical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Monthly Fee (DZD) *
              </label>
              <input
                type="number"
                required
                min="1000"
                step="500"
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({ ...formData, monthlyPrice: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#4F6EF7] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E293B] mb-1">
                Color Tag
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-10 p-1 border border-[#E2E8F0] rounded-xl cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1">
              Curriculum Description
            </label>
            <input
              type="text"
              placeholder="e.g. Critical thinking and philosophical texts for 3AS"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              Create Subject
            </Button>
          </div>
        </form>
      </Modal>
    </AppShell>
  );
}
