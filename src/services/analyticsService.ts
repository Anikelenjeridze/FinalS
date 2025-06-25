
import { Event } from '../pages/Index';

export interface EventStats {
  id: string;
  title: string;
  category: string;
  views: number;
  shares: number;
  qrScans: number;
  estimatedAttendance: number;
  popularityScore: number;
}

export interface AnalyticsData {
  totalEvents: number;
  totalViews: number;
  totalShares: number;
  popularEvents: EventStats[];
  categoryStats: { category: string; count: number; percentage: number }[];
  recentActivity: { date: string; views: number; shares: number }[];
}

class AnalyticsService {
  private ANALYTICS_KEY = 'eventAnalytics';

  getEventStats(eventId: string): EventStats | null {
    const analytics = this.getAnalytics();
    return analytics.find(stat => stat.id === eventId) || null;
  }

  updateEventViews(eventId: string, eventTitle: string, category: string): void {
    const analytics = this.getAnalytics();
    const existingIndex = analytics.findIndex(stat => stat.id === eventId);
    
    if (existingIndex >= 0) {
      analytics[existingIndex].views += 1;
      analytics[existingIndex].popularityScore = this.calculatePopularityScore(analytics[existingIndex]);
    } else {
      analytics.push({
        id: eventId,
        title: eventTitle,
        category,
        views: 1,
        shares: 0,
        qrScans: 0,
        estimatedAttendance: 0,
        popularityScore: 1
      });
    }
    
    this.saveAnalytics(analytics);
  }

  updateEventShares(eventId: string): void {
    const analytics = this.getAnalytics();
    const existingIndex = analytics.findIndex(stat => stat.id === eventId);
    
    if (existingIndex >= 0) {
      analytics[existingIndex].shares += 1;
      analytics[existingIndex].popularityScore = this.calculatePopularityScore(analytics[existingIndex]);
      this.saveAnalytics(analytics);
    }
  }

  updateQRScans(eventId: string): void {
    const analytics = this.getAnalytics();
    const existingIndex = analytics.findIndex(stat => stat.id === eventId);
    
    if (existingIndex >= 0) {
      analytics[existingIndex].qrScans += 1;
      analytics[existingIndex].estimatedAttendance = Math.floor(analytics[existingIndex].qrScans * 1.5);
      analytics[existingIndex].popularityScore = this.calculatePopularityScore(analytics[existingIndex]);
      this.saveAnalytics(analytics);
    }
  }

  getAnalyticsData(events: Event[]): AnalyticsData {
    const analytics = this.getAnalytics();
    const totalViews = analytics.reduce((sum, stat) => sum + stat.views, 0);
    const totalShares = analytics.reduce((sum, stat) => sum + stat.shares, 0);
    
    // Popular events (top 5 by popularity score)
    const popularEvents = analytics
      .sort((a, b) => b.popularityScore - a.popularityScore)
      .slice(0, 5);

    // Category statistics
    const categoryMap = new Map<string, number>();
    events.forEach(event => {
      categoryMap.set(event.category, (categoryMap.get(event.category) || 0) + 1);
    });
    
    const categoryStats = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / events.length) * 100)
    }));

    // Recent activity (last 7 days)
    const recentActivity = this.generateRecentActivity();

    return {
      totalEvents: events.length,
      totalViews,
      totalShares,
      popularEvents,
      categoryStats,
      recentActivity
    };
  }

  private calculatePopularityScore(stats: EventStats): number {
    return stats.views + (stats.shares * 3) + (stats.qrScans * 2);
  }

  private generateRecentActivity(): { date: string; views: number; shares: number }[] {
    const activity = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      activity.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 50) + 10,
        shares: Math.floor(Math.random() * 15) + 2
      });
    }
    
    return activity;
  }

  private getAnalytics(): EventStats[] {
    const data = localStorage.getItem(this.ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveAnalytics(analytics: EventStats[]): void {
    localStorage.setItem(this.ANALYTICS_KEY, JSON.stringify(analytics));
  }
}

export const analyticsService = new AnalyticsService();
