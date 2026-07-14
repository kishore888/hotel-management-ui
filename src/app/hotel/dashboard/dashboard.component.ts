import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  currentMonth = new Date();
  selectedDate = new Date();

  // Chart configurations
  occupancyChartData: ChartData<'line'> | undefined;
  occupancyChartOptions: ChartConfiguration<'line'>['options'] | undefined;
  
  revenueChartData: ChartData<'bar'> | undefined;
  revenueChartOptions: ChartConfiguration<'bar'>['options'] | undefined;
  
  roomDistributionData: ChartData<'doughnut'> | undefined;
  roomDistributionOptions: ChartConfiguration<'doughnut'>['options'] | undefined;

  statsCards = [
    { title: 'Total Rooms', value: 0, icon: 'door-closed', color: 'primary' },
    { title: 'Available', value: 0, icon: 'check-circle', color: 'success' },
    { title: 'Occupied', value: 0, icon: 'people', color: 'warning' },
    { title: 'Maintenance', value: 0, icon: 'tools', color: 'danger' },
    { title: 'Check-ins Today', value: 0, icon: 'arrow-right-circle', color: 'info' },
    { title: 'Check-outs Today', value: 0, icon: 'arrow-left-circle', color: 'secondary' }
  ];

  recentActivities = [
    { id: 1, type: 'check-in', guest: 'John Doe', room: '101', time: '10:30 AM' },
    { id: 2, type: 'check-out', guest: 'Jane Smith', room: '205', time: '09:15 AM' },
    { id: 3, type: 'booking', guest: 'Robert Johnson', room: '302', time: '08:45 AM' },
    { id: 4, type: 'maintenance', guest: '-', room: '108', time: '07:30 AM' },
    { id: 5, type: 'check-in', guest: 'Emily Davis', room: '401', time: 'Yesterday' }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeCharts();
    this.loadDashboardData();
  }

  initializeCharts(): void {
    // Occupancy Chart
    this.occupancyChartData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Occupied Rooms',
          data: [65, 75, 80, 72, 85, 92, 88],
          borderColor: '#FF9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          fill: true
        },
        {
          label: 'Available Rooms',
          data: [35, 25, 20, 28, 15, 8, 12],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          fill: true
        }
      ]
    };

    this.occupancyChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    };

    // Revenue Chart
    this.revenueChartData = {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      datasets: [
        {
          label: 'Revenue ($)',
          data: [12000, 15000, 18000, 14000, 20000],
          backgroundColor: [
            '#2196F3',
            '#4CAF50',
            '#FF9800',
            '#F44336',
            '#9C27B0'
          ],
          borderRadius: 5,
          borderSkipped: false
        }
      ]
    };

    this.revenueChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    };

    // Room Distribution Chart
    this.roomDistributionData = {
      labels: ['Available', 'Occupied', 'Maintenance', 'Booked'],
      datasets: [
        {
          data: [35, 55, 5, 5],
          backgroundColor: [
            '#4CAF50',
            '#FF9800',
            '#F44336',
            '#2196F3'
          ],
          borderColor: '#fff',
          borderWidth: 2
        }
      ]
    };

    this.roomDistributionOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      }
    };

    // Trigger change detection
    this.cdr.markForCheck();
  }

  loadDashboardData(): void {
    // TODO: Replace with actual API calls
    // This will be populated dynamically later
  }

  getDaysInMonth(): number[] {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  getMonthName(): string {
    return this.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
  }

  getRoomStatus(day: number): string {
    // TODO: Return actual room status based on bookings
    // This is a placeholder - will be populated from API
    const statuses = ['available', 'occupied', 'booked', 'maintenance'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'check-in': 'arrow-right-circle',
      'check-out': 'arrow-left-circle',
      'booking': 'calendar-check',
      'maintenance': 'tools'
    };
    return icons[type] || 'circle';
  }

  getActivityColor(type: string): string {
    const colors: { [key: string]: string } = {
      'check-in': 'text-success',
      'check-out': 'text-info',
      'booking': 'text-primary',
      'maintenance': 'text-danger'
    };
    return colors[type] || 'text-secondary';
  }
}
