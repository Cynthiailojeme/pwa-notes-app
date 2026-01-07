"use client";

import { useSync } from "@/hooks/useSync";
import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function SyncStatus() {
  const { isOnline, isSyncing, pendingCount, triggerSync } = useSync();
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  // Show success message briefly after sync completes
  useEffect(() => {
    if (!isSyncing && pendingCount === 0 && isOnline) {
      setShowSyncSuccess(true);
      const timer = setTimeout(() => setShowSyncSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSyncing, pendingCount, isOnline]);

  // Determine the message to show
  const getMessage = () => {
    if (!isOnline) {
      return {
        text: "You're offline – notes will sync when you're back online",
        icon: <CloudOff className="w-5 h-5 text-gray-500" />,
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
        borderColor: "border-gray-200",
      };
    }

    if (isSyncing) {
      return {
        text: "Syncing your changes...",
        icon: <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
      };
    }

    if (pendingCount > 0) {
      return {
        text: `${pendingCount} ${
          pendingCount === 1 ? "change" : "changes"
        } waiting to sync`,
        icon: <AlertCircle className="w-5 h-5 text-amber-600" />,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
      };
    }

    if (showSyncSuccess) {
      return {
        text: "All changes saved",
        icon: <Check className="w-5 h-5 text-green-600" />,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
      };
    }

    return {
      text: "All changes saved",
      icon: <Cloud className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    };
  };

  const status = getMessage();

  return (
    <div
      className={`inline-flex items-center gap-3 px-4 py-3 rounded-lg shadow-sm border transition-all duration-300 ${status.bgColor} ${status.borderColor}`}
    >
      {/* Status Icon with animation */}
      <div className="shrink-0">{status.icon}</div>

      {/* Status Message */}
      <span className={`text-sm font-medium ${status.textColor}`}>
        {status.text}
      </span>

      {/* Pending Count */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-md">
          <span className="text-sm text-amber-700">{pendingCount} pending</span>
        </div>
      )}

      {/* Sync Button - only show when there are pending changes and online */}
      {isOnline && pendingCount > 0 && !isSyncing && (
        <button
          onClick={triggerSync}
          disabled={isSyncing}
          className="ml-2 flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          aria-label="Sync now"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync now</span>
        </button>
      )}
    </div>
  );
}
