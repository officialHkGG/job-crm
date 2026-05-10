"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

type Job = {
  id: string;
  company: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
};

const COLORS = [
  "#3B82F6",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
];

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*");

      if (error) {
        console.error(error);
      } else {
        setJobs(data || []);
      }

      setLoading(false);
    }

    fetchJobs();
  }, []);

  const totalJobs = jobs.length;

  const appliedJobs = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interviewJobs = jobs.filter(
    (job) => job.status === "Interview"
  ).length;

  const offerJobs = jobs.filter(
    (job) => job.status === "Offer"
  ).length;

  const rejectedJobs = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  const interviewRate =
    totalJobs > 0
      ? ((interviewJobs / totalJobs) * 100).toFixed(1)
      : 0;

  const statusData = [
    { name: "Saved", value: jobs.filter((j) => j.status === "Saved").length },
    { name: "Applied", value: appliedJobs },
    { name: "Interview", value: interviewJobs },
    { name: "Offer", value: offerJobs },
    { name: "Rejected", value: rejectedJobs },
  ];

  const priorityData = [
    {
      name: "High",
      value: jobs.filter((j) => j.priority === "High").length,
    },
    {
      name: "Medium",
      value: jobs.filter((j) => j.priority === "Medium").length,
    },
    {
      name: "Low",
      value: jobs.filter((j) => j.priority === "Low").length,
    },
  ];

  const trendData = useMemo(() => {
    const grouped: Record<string, number> = {};

    jobs.forEach((job) => {
      const date = new Date(job.created_at)
        .toISOString()
        .split("T")[0];

      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      count,
    }));
  }, [jobs]);

  if (loading) {
    return <p className="text-black">Loading dashboard...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-black">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-5 gap-4 mb-10">
        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">Total Jobs</p>
          <h2 className="text-3xl font-bold text-black">
            {totalJobs}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">Applied</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {appliedJobs}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">Interviews</p>
          <h2 className="text-3xl font-bold text-yellow-500">
            {interviewJobs}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">Offers</p>
          <h2 className="text-3xl font-bold text-green-600">
            {offerJobs}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500">Interview Rate</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {interviewRate}%
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-6 text-black">
            Application Status
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-6 text-black">
            Priority Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {priorityData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-6 text-black">
          Application Trend
        </h2>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={trendData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}