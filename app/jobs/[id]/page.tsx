"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

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

export default function JobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setJob(data);
      }

      setLoading(false);
    }

    fetchJob();
  }, [params.id]);

  if (loading) {
    return <p className="text-black">Loading job...</p>;
  }

  if (!job) {
    return <p className="text-black">Job not found.</p>;
  }

  return (
    <div>
      <Link href="/jobs" className="text-blue-600 underline">
        ← Back to Jobs
      </Link>

      <div className="bg-white border rounded-xl p-6 mt-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">
              {job.title}
            </h1>

            <p className="text-xl text-gray-700 mt-2">
              {job.company}
            </p>
          </div>

          {job.favorite && <span className="text-3xl">⭐</span>}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <Detail label="Status" value={job.status} />
          <Detail label="Priority" value={job.priority} />
          <Detail label="Location" value={job.location} />
          <Detail label="Salary" value={job.salary} />
          <Detail label="Contact" value={job.contact} />
          <Detail label="Company Type" value={job.company_type} />
          <Detail label="Source" value={job.source} />
          <Detail label="Applied Date" value={job.applied_date} />
          <Detail label="Interview Date" value={job.interview_date} />
          <Detail label="Follow-up Date" value={job.follow_up_date} />
        </div>

        {job.link && (
          <a
            href={job.link}
            target="_blank"
            className="inline-block mt-6 bg-black text-white px-4 py-2 rounded-lg"
          >
            Open Job Posting
          </a>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-black mb-2">
            Notes
          </h2>

          <p className="text-gray-700 whitespace-pre-wrap">
            {job.notes || "No notes yet."}
          </p>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-black mt-1">
        {value || "—"}
      </p>
    </div>
  );
}