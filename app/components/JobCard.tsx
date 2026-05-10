import Link from "next/link";

type JobCardProps = {
  id: string;
  company: string;
  title: string;
  status: string;
  link: string;
  location: string;
  notes: string;
  appliedDate: string;
  interviewDate: string;
  followUpDate: string;
  priority: string;
  salary: string;
  contact: string;
  companyType: string;
  source: string;
  favorite: boolean;
  onStatusChange: (newStatus: string) => void;
  onDelete: () => void;
  onEdit: () => void;
  onToggleFavorite: () => void;
};

export default function JobCard({
  id,
  company,
  title,
  status,
  link,
  location,
  notes,
  appliedDate,
  interviewDate,
 followUpDate,
  priority,
  salary,
  contact,
  companyType,
  source,
  favorite,
  onStatusChange,
  onDelete,
  onEdit,
  onToggleFavorite,
}: JobCardProps) {
  function getStatusColor() {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-700";
      case "Interview":
        return "bg-yellow-100 text-yellow-700";
      case "Offer":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getPriorityColor() {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div className="border rounded-xl p-5 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-black">
                {title}
              </h2>

              <p className="text-gray-800">{company}</p>
            </div>

            <button
              onClick={onToggleFavorite}
              className="text-2xl"
            >
              {favorite ? "⭐" : "☆"}
            </button>
          </div>

          {companyType && (
            <p className="text-sm text-gray-800">
              🏢 {companyType}
            </p>
          )}

          {source && (
            <p className="text-sm text-gray-800">
              🌐 Source: {source}
            </p>
          )}

          {location && (
            <p className="text-sm text-gray-800">
              📍 {location}
            </p>
          )}

          {salary && (
            <p className="text-sm text-gray-800">
              💰 {salary}
            </p>
          )}

          {contact && (
            <p className="text-sm text-gray-800">
              👤 {contact}
            </p>
          )}

          {appliedDate && (
            <p className="text-sm text-gray-800">
              📅 Applied: {appliedDate}
            </p>
          )}

          {interviewDate && (
            <p className="text-sm text-gray-800">
              🗓 Interview: {interviewDate}
            </p>
          )}

          {followUpDate && (
            <p className="text-sm text-gray-800">
              🔔 Follow up: {followUpDate}
            </p>
          )}

          {priority && (
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${getPriorityColor()}`}
            >
              {priority} Priority
            </span>
          )}

          {link && (
            <a
              href={link}
              target="_blank"
              className="block text-blue-600 underline text-sm"
            >
              View Job Posting
            </a>
          )}

          {notes && (
            <p className="text-sm text-gray-800">
              📝 {notes}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 items-end">
          <select
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value)
            }
            className={`px-3 py-2 rounded-full text-sm border ${getStatusColor()}`}
          >
            <option>Saved</option>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <div className="flex flex-col items-end gap-2">
            <Link
              href={`/jobs/${id}`}
              className="text-sm text-purple-600 hover:underline"
            >
              View Details
            </Link>

            <button
              onClick={onEdit}
              className="text-blue-600 text-sm hover:underline"
            >
              Edit
            </button>

            <button
              onClick={onDelete}
              className="text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}