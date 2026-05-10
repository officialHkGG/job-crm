"use client";

import { useEffect, useMemo, useState } from "react";
import JobCard from "../components/JobCard";
import { supabase } from "../../lib/supabase";

type Job = {
  id: string;
  company: string;
  title: string;
  status: string;
  link: string;
  location: string;
  notes: string;
  applied_date: string;
  interview_date: string;
  follow_up_date: string;
  priority: string;
  salary: string;
  contact: string;
  company_type: string;
  source: string;
  favorite: boolean;
  created_at: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [contact, setContact] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [companyType, setCompanyType] = useState("Startup");
  const [source, setSource] = useState("LinkedIn");
  const [notes, setNotes] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [companyTypeFilter, setCompanyTypeFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setJobs(data || []);
      }

      setLoading(false);
    }

    fetchJobs();
  }, []);

  function resetForm() {
    setCompany("");
    setTitle("");
    setLink("");
    setLocation("");
    setSalary("");
    setContact("");
    setAppliedDate("");
    setInterviewDate("");
    setFollowUpDate("");
    setPriority("Medium");
    setCompanyType("Startup");
    setSource("LinkedIn");
    setNotes("");
    setEditingJobId(null);
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCompanyTypeFilter("All");
    setSourceFilter("All");
    setSortBy("Newest");
  }

  async function saveJob() {
    if (!company || !title) return;

    const jobData = {
      company,
      title,
      link,
      location,
      salary,
      contact,
      applied_date: appliedDate,
      interview_date: interviewDate,
      follow_up_date: followUpDate,
      priority,
      company_type: companyType,
      source,
      notes,
    };

    if (editingJobId) {
      const { data, error } = await supabase
        .from("jobs")
        .update(jobData)
        .eq("id", editingJobId)
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setJobs(jobs.map((job) => (job.id === editingJobId ? data : job)));
      resetForm();
      return;
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        ...jobData,
        status: "Saved",
        favorite: false,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setJobs([data, ...jobs]);
    resetForm();
  }

  async function deleteJob(id: string) {
    const { error } = await supabase.from("jobs").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setJobs(jobs.filter((job) => job.id !== id));
  }

  function startEdit(job: Job) {
    setCompany(job.company);
    setTitle(job.title);
    setLink(job.link || "");
    setLocation(job.location || "");
    setSalary(job.salary || "");
    setContact(job.contact || "");
    setAppliedDate(job.applied_date || "");
    setInterviewDate(job.interview_date || "");
    setFollowUpDate(job.follow_up_date || "");
    setPriority(job.priority || "Medium");
    setCompanyType(job.company_type || "Startup");
    setSource(job.source || "LinkedIn");
    setNotes(job.notes || "");
    setEditingJobId(job.id);
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setJobs(
      jobs.map((job) =>
        job.id === id ? { ...job, status: newStatus } : job
      )
    );
  }

  async function toggleFavorite(id: string, favorite: boolean) {
    const { error } = await supabase
      .from("jobs")
      .update({ favorite: !favorite })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setJobs(
      jobs.map((job) =>
        job.id === id ? { ...job, favorite: !favorite } : job
      )
    );
  }

  const filteredJobs = useMemo(() => {
    const filtered = jobs.filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        job.company.toLowerCase().includes(searchText) ||
        job.title.toLowerCase().includes(searchText) ||
        job.contact?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || job.priority === priorityFilter;

      const matchesCompanyType =
        companyTypeFilter === "All" || job.company_type === companyTypeFilter;

      const matchesSource =
        sourceFilter === "All" || job.source === sourceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCompanyType &&
        matchesSource
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "Oldest") {
        return a.created_at.localeCompare(b.created_at);
      }

      if (sortBy === "Newest") {
        return b.created_at.localeCompare(a.created_at);
      }

      if (sortBy === "Applied Date") {
        return (b.applied_date || "").localeCompare(a.applied_date || "");
      }

      if (sortBy === "Interview Date") {
        return (a.interview_date || "9999-99-99").localeCompare(
          b.interview_date || "9999-99-99"
        );
      }

      if (sortBy === "Follow-up Date") {
        return (a.follow_up_date || "9999-99-99").localeCompare(
          b.follow_up_date || "9999-99-99"
        );
      }

      if (sortBy === "Priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };

        return (
          priorityOrder[b.priority as keyof typeof priorityOrder] -
          priorityOrder[a.priority as keyof typeof priorityOrder]
        );
      }

      return 0;
    });
  }, [
    jobs,
    search,
    statusFilter,
    priorityFilter,
    companyTypeFilter,
    sourceFilter,
    sortBy,
  ]);

  if (loading) {
    return <p className="text-black">Loading jobs...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Jobs</h1>
      </div>

      <div className="border rounded-xl p-5 mb-8 bg-white">
        <h2 className="text-xl font-semibold mb-4 text-black">
          {editingJobId ? "Edit Job" : "Add Job"}
        </h2>

        <div className="grid gap-4">
          <input className="border rounded-lg p-3 text-black bg-white" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
          <input className="border rounded-lg p-3 text-black bg-white" placeholder="Job title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="border rounded-lg p-3 text-black bg-white" placeholder="Job link" value={link} onChange={(e) => setLink(e.target.value)} />
          <input className="border rounded-lg p-3 text-black bg-white" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <input className="border rounded-lg p-3 text-black bg-white" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} />
          <input className="border rounded-lg p-3 text-black bg-white" placeholder="Contact / recruiter" value={contact} onChange={(e) => setContact(e.target.value)} />

          <label className="text-sm text-gray-700">Applied date</label>
          <input type="date" className="border rounded-lg p-3 text-black bg-white" value={appliedDate} onChange={(e) => setAppliedDate(e.target.value)} />

          <label className="text-sm text-gray-700">Interview date</label>
          <input type="date" className="border rounded-lg p-3 text-black bg-white" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)} />

          <label className="text-sm text-gray-700">Follow-up date</label>
          <input type="date" className="border rounded-lg p-3 text-black bg-white" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />

          <select className="border rounded-lg p-3 text-black bg-white" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select className="border rounded-lg p-3 text-black bg-white" value={companyType} onChange={(e) => setCompanyType(e.target.value)}>
            <option>Startup</option>
            <option>Scaleup</option>
            <option>Enterprise</option>
            <option>Agency</option>
            <option>Consulting</option>
          </select>

          <select className="border rounded-lg p-3 text-black bg-white" value={source} onChange={(e) => setSource(e.target.value)}>
            <option>LinkedIn</option>
            <option>Indeed</option>
            <option>Arbetsförmedlingen</option>
            <option>Company Website</option>
            <option>Referral</option>
            <option>Other</option>
          </select>

          <textarea className="border rounded-lg p-3 text-black bg-white" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="flex gap-3">
            <button onClick={saveJob} className="bg-black text-white px-4 py-2 rounded-lg">
              {editingJobId ? "Update Job" : "Save Job"}
            </button>

            {editingJobId && (
              <button onClick={resetForm} className="border px-4 py-2 rounded-lg text-black">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-7 gap-4 mb-6">
        <input className="border rounded-lg p-3 text-black bg-white" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <select className="border rounded-lg p-3 text-black bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Saved</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <select className="border rounded-lg p-3 text-black bg-white" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select className="border rounded-lg p-3 text-black bg-white" value={companyTypeFilter} onChange={(e) => setCompanyTypeFilter(e.target.value)}>
          <option>All</option>
          <option>Startup</option>
          <option>Scaleup</option>
          <option>Enterprise</option>
          <option>Agency</option>
          <option>Consulting</option>
        </select>

        <select className="border rounded-lg p-3 text-black bg-white" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
          <option>All</option>
          <option>LinkedIn</option>
          <option>Indeed</option>
          <option>Arbetsförmedlingen</option>
          <option>Company Website</option>
          <option>Referral</option>
          <option>Other</option>
        </select>

        <select className="border rounded-lg p-3 text-black bg-white" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Applied Date</option>
          <option>Interview Date</option>
          <option>Follow-up Date</option>
          <option>Priority</option>
        </select>

        <button onClick={resetFilters} className="border rounded-lg p-3 text-black bg-white">
          Reset Filters
        </button>
      </div>

      <p className="mb-4 text-gray-700">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </p>

      {filteredJobs.length === 0 ? (
        <div className="border rounded-xl p-8 bg-white text-center">
          <h2 className="text-xl font-semibold text-black">No jobs found</h2>
          <p className="text-gray-600 mt-2">Try adding your first job.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <JobCard
            
              key={job.id}
              id={job.id}
              company={job.company}
              title={job.title}
              status={job.status}
              link={job.link}
              location={job.location}
              notes={job.notes}
              appliedDate={job.applied_date}
              interviewDate={job.interview_date}
              followUpDate={job.follow_up_date}
              priority={job.priority}
              salary={job.salary}
              contact={job.contact}
              companyType={job.company_type}
              source={job.source}
              favorite={job.favorite}
              onEdit={() => startEdit(job)}
              onDelete={() => deleteJob(job.id)}
              onToggleFavorite={() => toggleFavorite(job.id, job.favorite)}
              onStatusChange={(newStatus) => updateStatus(job.id, newStatus)}
            />
          ))}
        </div>
      )}
    </div>
  );
}