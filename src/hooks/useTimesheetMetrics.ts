import { useMemo } from 'react';
import { TimesheetEntry, TeamMember } from '../types';

export const useTimesheetMetrics = (timesheet: TimesheetEntry[], teamMembers: TeamMember[]) => {
  return useMemo(() => {
    const totalHoursLogged = timesheet.reduce((acc, curr) => acc + curr.hours, 0);

    const memberHours = teamMembers.map(m => {
      const total = timesheet.filter(t => t.member === m.name).reduce((acc, curr) => acc + curr.hours, 0);
      return { ...m, hours: total };
    });

    return {
      totalHoursLogged,
      memberHours,
    };
  }, [timesheet, teamMembers]);
};
