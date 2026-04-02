import { useEffect, useState } from "react";
import type { AttendanceDTO, WorkerAttendance } from "@/modules/attendance/types/types";
import { attendanceService } from "@/modules/attendance/services/attendanceService";
import { staffService } from "@/modules/staff/services/staffService";

export function useAttendance() {
  const [workers, setWorkers] = useState<WorkerAttendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [attendances, setAttendances] = useState<AttendanceDTO[]>([]);

  const loadWorkers = async () => {
    try {
      const data = await staffService.getAllStaffs();
      return data || [];
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      return [];
    }
  };

  const loadAttendances = async (date: string) => {
    try {
      const data = await attendanceService.list(date);
      return data || [];
    } catch (err: unknown) {
      // If no attendances, it's ok
      return [];
    }
  };

  const load = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const [workersData, attendancesData] = await Promise.all([
        loadWorkers(),
        loadAttendances(date)
      ]);
      setAttendances(attendancesData);
      const workerAttendances: WorkerAttendance[] = workersData.map(worker => {
        const attendance = attendancesData.find(a => a.workerId === worker.id);
        return {
          workerId: worker.id.toString(),
          workerName: worker.staffname,
          checkInTime: attendance ? attendance.checkInTime : null,
        };
      });
      setWorkers(workerAttendances);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(selectedDate);
  }, [selectedDate, load]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const toggleAttendance = (workerId: string) => {
    setWorkers(prev => prev.map(w =>
      w.workerId === workerId ? {
        ...w,
        checkInTime: w.checkInTime ? null : new Date().toTimeString().slice(0, 5) // HH:MM
      } : w
    ));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      for (const worker of workers) {
        const existing = attendances.find(a => a.workerId === worker.workerId);
        if (existing) {
          if (existing.checkInTime !== worker.checkInTime) {
            await attendanceService.update(existing.id, {
              workerId: worker.workerId,
              date: selectedDate,
              checkInTime: worker.checkInTime,
            });
          }
        } else if (worker.checkInTime) {
          await attendanceService.create({
            workerId: worker.workerId,
            date: selectedDate,
            checkInTime: worker.checkInTime,
          });
        }
      }
      await load(selectedDate); // reload to get updated ids
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return {
    workers,
    loading,
    error,
    selectedDate,
    handleDateChange,
    toggleAttendance,
    handleSave,
  } as const;
}

export default useAttendance;
