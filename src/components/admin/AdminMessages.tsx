import { useState } from "react";
import { useAdminData, ContactMessage } from "../../context/AdminDataContext";
import { Mail, Phone, Trash2, Eye, Inbox, CheckCheck, Search } from "lucide-react";

export default function AdminMessages() {
  const { messages, markMessageRead, removeMessage } = useAdminData();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewing, setViewing] = useState<ContactMessage | null>(null);

  const filtered = messages.filter((m) => {
    const matchFilter = filter === "all" || (filter === "unread" ? !m.read : m.read);
    const matchSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleView = (m: ContactMessage) => {
    setViewing(m);
    if (!m.read) markMessageRead(m.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Customer inquiries and contact form submissions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: "all" as const, label: "All", count: messages.length },
            { key: "unread" as const, label: "Unread", count: messages.filter(m => !m.read).length },
            { key: "read" as const, label: "Read", count: messages.filter(m => m.read).length },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                filter === f.key ? "bg-primary text-white" : "bg-gray-custom text-dark/70 hover:bg-primary/10"
              }`}
            >
              {f.label} <span className="text-xs opacity-70">({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No messages found</p>
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.id}
              onClick={() => handleView(m)}
              className={`p-4 sm:p-5 flex items-start gap-3 cursor-pointer hover:bg-gray-custom transition-colors ${
                !m.read ? "bg-primary/5" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                !m.read ? "bg-accent text-white" : "bg-gray-custom text-gray-500"
              }`}>
                {m.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`truncate ${!m.read ? "font-bold text-dark" : "font-medium text-dark/80"}`}>{m.name}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0">{new Date(m.date).toLocaleDateString()}</span>
                </div>
                <p className={`text-sm truncate ${!m.read ? "text-dark font-semibold" : "text-gray-600"}`}>{m.subject}</p>
                <p className="text-sm text-gray-500 mt-1 truncate">{m.message}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!m.read && <span className="w-2 h-2 rounded-full bg-accent" />}
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex items-start justify-between">
              <div>
                <span className="text-xs text-gray-500">From</span>
                <h2 className="text-lg font-bold text-dark">{viewing.name}</h2>
                <p className="text-sm text-gray-600">{viewing.subject}</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-gray-500 hover:text-dark text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5 text-sm">
                <p className="flex items-center gap-2 text-gray-600"><Mail className="w-4 h-4 text-gray-400" /> {viewing.email}</p>
                {viewing.phone && <p className="flex items-center gap-2 text-gray-600"><Phone className="w-4 h-4 text-gray-400" /> {viewing.phone}</p>}
                <p className="text-xs text-gray-400">Received: {new Date(viewing.date).toLocaleString()}</p>
              </div>
              <div className="bg-gray-custom rounded-xl p-4">
                <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">{viewing.message}</p>
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <a href={`mailto:${viewing.email}`} className="flex-1 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-all text-center">
                  <Mail className="w-4 h-4 inline mr-1" /> Reply via Email
                </a>
                {viewing.read && (
                  <span className="px-4 py-2.5 bg-green-100 text-green-700 text-sm font-semibold rounded-lg flex items-center gap-1.5">
                    <CheckCheck className="w-4 h-4" /> Read
                  </span>
                )}
                <button onClick={() => { removeMessage(viewing.id); setViewing(null); }} className="px-3 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
