import { useMemo } from 'react';
import { Project } from '../types';

export const usePortfolioMetrics = (projects: Project[]) => {
  return useMemo(() => {
    const totalProjects = projects.length;
    
    const totalPortfolioBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);

    const totalRealizedBudget = projects.reduce((acc, curr) => {
      const projSpent = curr.canvasData.planoAcao.reduce((a, c) => a + c.investment * (c.progress / 100), 0);
      return acc + projSpent;
    }, 0);

    const averageProgress = Math.round(
      projects.reduce((acc, curr) => {
        const pAvg = curr.canvasData.planoAcao.reduce((a, c) => a + c.progress, 0) / (curr.canvasData.planoAcao.length || 1);
        return acc + pAvg;
      }, 0) / (totalProjects || 1)
    );

    const totalHoursLogged = projects.reduce((acc, curr) => {
      return acc + curr.timesheet.reduce((a, c) => a + c.hours, 0);
    }, 0);

    return {
      totalProjects,
      totalPortfolioBudget,
      totalRealizedBudget,
      averageProgress,
      totalHoursLogged,
    };
  }, [projects]);
};
