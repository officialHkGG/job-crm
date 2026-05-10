"use client";
import Link from "next/link";


import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Job = {
  id: string;
  company: string;
  title: string;
  status: string;
  favorite: boolean;
  location: string;
  priority: string;
  source: string;
  interview_date: string;
  follow_up_date: string;
  created_at: string;
};

const columns = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

export default function BoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

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

  async function updateJobStatus(jobId: string, newStatus: string) {
    const { error } = await supabase
      .from("jobs")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (error) {
      console.error(error);
      return;
    }

    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  const filteredJobs = useMemo(() => {
    const searchText = search.toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(searchText) ||
        job.title.toLowerCase().includes(searchText) ||
        job.location?.toLowerCase().includes(searchText) ||
        job.source?.toLowerCase().includes(searchText);

      const matchesPriority =
        priorityFilter === "All" || job.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [jobs, search, priorityFilter]);

  if (loading) {
    return <p className="text-black">Loading board...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-black">Job Board</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <input
          className="border rounded-lg p-3 w-full text-black placeholder:text-gray-500 bg-white"
          placeholder="Search board..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg p-3 w-full text-black bg-white"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {columns.map((column) => {
          const count = filteredJobs.filter(
            (job) => job.status === column
          ).length;

          return (
            <div key={column} className="border rounded-xl p-4 bg-white">
              <p className="text-gray-600">{column}</p>
              <h2 className="text-2xl font-bold text-black">{count}</h2>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        {columns.map((column) => {
          const columnJobs = filteredJobs.filter(
            (job) => job.status === column
          );

          return (
            <div
              key={column}
              className="bg-white border rounded-xl p-4 min-h-[500px]"
            >
              <h2 className="text-xl font-semibold mb-4 text-black">
                {column}
              </h2>

              <div className="grid gap-3">
                {columnJobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
  href={`/jobs/${job.id}`}
  className="font-semibold text-black hover:underline"
>
  {job.title}
</Link>

                        <p className="text-gray-700">{job.company}</p>
                      </div>

                      {job.favorite && <span className="text-xl">⭐</span>}
                    </div>

                    <div className="mt-3 space-y-1">
                      {job.location && (
                        <p className="text-sm text-gray-700">
                          📍 {job.location}
                        </p>
                      )}

                      {job.source && (
                        <p className="text-sm text-gray-700">
                          🌐 {job.source}
                        </p>
                      )}

                      {job.interview_date && (
                        <p className="text-sm text-gray-700">
                          🗓 {job.interview_date}
                        </p>
                      )}

                      {job.follow_up_date && (
                        <p className="text-sm text-gray-700">
                          🔔 {job.follow_up_date}
                        </p>
                      )}

                      {job.priority && (
                        <span
                          className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${getPriorityColor(
                            job.priority
                          )}`}
                        >
                          {job.priority}
                        </span>
                      )}
                    </div>

                    <select
                      className="mt-4 border rounded-lg p-2 w-full text-black bg-white"
                      value={job.status}
                      onChange={(e) =>
                        updateJobStatus(job.id, e.target.value)
                      }
                    >
                      <option>Saved</option>
                      <option>Applied</option>
                      <option>Interview</option>
                      <option>Offer</option>
                      <option>Rejected</option>
                    </select>
                  </div>
                ))}

                {columnJobs.length === 0 && (
                  <p className="text-sm text-gray-500">No jobs here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}