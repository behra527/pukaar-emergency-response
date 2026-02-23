class HistorySystem {
    constructor() {
        this.currentLanguage = 'ur';
        this.historyData = this.generateMockHistoryData();
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredData = [...this.historyData];
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.renderHistoryTable();
        this.updateStatistics();
        setInterval(() => this.updateDateTime(), 1000);
    }
    
    generateMockHistoryData() {
        return [
            { id: 'EMG-2025-0142', time: '14:32', date: '2025-02-23', type: 'medical', location: 'اسلام آباد، F-8 مارکیٹ', status: 'active', responseTime: '2.3', priority: 'high' },
            { id: 'EMG-2025-0141', time: '13:45', date: '2025-02-23', type: 'fire', location: 'لاہور، گارڈن ٹاؤن', status: 'completed', responseTime: '5.1', priority: 'medium' },
            { id: 'EMG-2025-0140', time: '12:20', date: '2025-02-23', type: 'accident', location: 'ملتان، ایچ-9 بلاک', status: 'completed', responseTime: '3.8', priority: 'low' },
            { id: 'EMG-2025-0139', time: '11:15', date: '2025-02-23', type: 'police', location: 'کراچی، ٹاؤن ہال', status: 'completed', responseTime: '1.2', priority: 'medium' },
            { id: 'EMG-2025-0138', time: '10:30', date: '2025-02-23', type: 'medical', location: 'پشاور، قدیم شہر', status: 'completed', responseTime: '4.5', priority: 'high' },
            { id: 'EMG-2025-0137', time: '09:45', date: '2025-02-23', type: 'fire', location: 'ملتان، صنعتی علاقہ', status: 'pending', responseTime: '-', priority: 'medium' },
            { id: 'EMG-2025-0136', time: '08:15', date: '2025-02-23', type: 'accident', location: 'سکھر، شاہراہ فیکٹری', status: 'completed', responseTime: '2.9', priority: 'low' },
            { id: 'EMG-2025-0135', time: '07:30', date: '2025-02-23', type: 'police', location: 'فیصل آباد، سٹیڈیم', status: 'completed', responseTime: '3.3', priority: 'medium' },
            { id: 'EMG-2025-0134', time: '06:45', date: '2025-02-23', type: 'medical', location: 'راولپنڈی، جناح اسپتال', status: 'completed', responseTime: '6.2', priority: 'high' },
            { id: 'EMG-2025-0133', time: '05:20', date: '2025-02-23', type: 'fire', location: 'حیدرآباد، قاسم آباد', status: 'completed', responseTime: '4.8', priority: 'medium' },
            { id: 'EMG-2025-0132', time: '04:10', date: '2025-02-23', type: 'accident', location: 'ملتان، شاہراہ کالونی', status: 'completed', responseTime: '2.1', priority: 'low' },
            { id: 'EMG-2025-0131', time: '03:30', date: '2025-02-23', type: 'police', location: 'گوجرانوالہ، سولہٹی', status: 'completed', responseTime: '1.8', priority: 'medium' }
        ];
    }
    
    setupEventListeners() {
        // Filter controls
        document.getElementById('dateFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('typeFilter')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('statusFilter')?.addEventListener('change', () => this.applyFilters());
        document.querySelector('.filter-btn')?.addEventListener('click', () => this.applyFilters());
        document.querySelector('.export-btn')?.addEventListener('click', () => this.exportHistory());
        
        // Table controls
        document.querySelectorAll('.table-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (index === 0) this.sortByNewest();
                else if (index === 1) this.sortByOldest();
                else if (index === 2) this.showMyReports();
            });
        });
        
        // Pagination
        document.querySelectorAll('.page-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const pageNumber = parseInt(btn.textContent);
                if (!isNaN(pageNumber)) {
                    this.goToPage(pageNumber);
                }
            });
        });
        
        // Language selector
        document.getElementById('languageSelect')?.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
    }
    
    updateDateTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ur-PK', { hour12: false });
        const dateStr = now.toLocaleDateString('ur-PK');
        
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        if (timeElement) timeElement.textContent = timeStr;
        if (dateElement) dateElement.textContent = dateStr;
    }
    
    applyFilters() {
        const dateFilter = document.getElementById('dateFilter')?.value;
        const typeFilter = document.getElementById('typeFilter')?.value;
        const statusFilter = document.getElementById('statusFilter')?.value;
        
        this.filteredData = this.historyData.filter(item => {
            let match = true;
            
            if (dateFilter && item.date !== dateFilter) match = false;
            if (typeFilter !== 'all' && item.type !== typeFilter) match = false;
            if (statusFilter !== 'all' && item.status !== statusFilter) match = false;
            
            return match;
        });
        
        this.currentPage = 1;
        this.renderHistoryTable();
        this.updateStatistics();
    }
    
    renderHistoryTable() {
        const tbody = document.querySelector('.data-table tbody');
        if (!tbody) return;
        
        // Clear existing rows
        tbody.innerHTML = '';
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);
        
        // Render rows
        pageData.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'table-row';
            
            const priorityClass = item.priority === 'high' ? 'high-priority' : 
                                  item.priority === 'medium' ? 'medium-priority' : 'low-priority';
            
            row.innerHTML = `
                <td>
                    <span class="report-id">${item.id}</span>
                    <span class="priority-badge ${priorityClass}">${this.getPriorityText(item.priority)}</span>
                </td>
                <td>${item.time}</td>
                <td>
                    <span class="type-icon ${item.type}">${this.getTypeIcon(item.type)}</span>
                    ${this.getTypeText(item.type)}
                </td>
                <td>${item.location}</td>
                <td><span class="status-badge ${item.status}">${this.getStatusText(item.status)}</span></td>
                <td>${item.responseTime}${item.responseTime !== '-' ? ' منٹ' : ''}</td>
                <td>
                    <button class="table-action-btn" onclick="historySystem.viewDetails('${item.id}')">تفصیل</button>
                    <button class="table-action-btn" onclick="historySystem.downloadReport('${item.id}')">ڈاؤن لوڈ</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Update pagination
        this.updatePagination();
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        const pageNumbers = document.querySelector('.page-numbers');
        if (!pageNumbers) return;
        
        pageNumbers.innerHTML = '';
        
        // Generate page numbers
        const maxPages = Math.min(totalPages, 5);
        for (let i = 1; i <= maxPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'page-btn';
            if (i === this.currentPage) pageBtn.classList.add('active');
            pageBtn.textContent = i;
            pageNumbers.appendChild(pageBtn);
        }
        
        // Add ellipsis if there are more pages
        if (totalPages > 5) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
            
            const lastPageBtn = document.createElement('button');
            lastPageBtn.className = 'page-btn';
            lastPageBtn.textContent = totalPages;
            pageNumbers.appendChild(lastPageBtn);
        }
        
        // Update prev/next buttons
        const prevBtn = document.querySelector('.pagination button:first-child');
        const nextBtn = document.querySelector('.pagination button:last-child');
        
        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
    }
    
    updateStatistics() {
        const total = this.filteredData.length;
        const completed = this.filteredData.filter(item => item.status === 'completed').length;
        const pending = this.filteredData.filter(item => item.status === 'pending').length;
        const active = this.filteredData.filter(item => item.status === 'active').length;
        
        // Update stat cards
        const statCards = document.querySelectorAll('.stat-value');
        if (statCards[0]) statCards[0].textContent = total;
        if (statCards[1]) statCards[1].textContent = completed;
        if (statCards[2]) statCards[2].textContent = pending;
        if (statCards[3]) statCards[3].textContent = active;
    }
    
    getPriorityText(priority) {
        const texts = {
            high: 'ہائی',
            medium: 'میڈیم',
            low: 'لو'
        };
        return texts[priority] || priority;
    }
    
    getTypeIcon(type) {
        const icons = {
            medical: '🏥',
            fire: '🔥',
            accident: '🚗',
            police: '👮'
        };
        return icons[type] || '📋';
    }
    
    getTypeText(type) {
        const texts = {
            medical: 'میڈیکل',
            fire: 'اگ بجھاؤ',
            accident: 'حادثہ',
            police: 'پولیس'
        };
        return texts[type] || type;
    }
    
    getStatusText(status) {
        const texts = {
            active: 'فعال',
            completed: 'مکمل',
            pending: 'زیر غور'
        };
        return texts[status] || status;
    }
    
    sortByNewest() {
        this.filteredData.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
        this.renderHistoryTable();
    }
    
    sortByOldest() {
        this.filteredData.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
        this.renderHistoryTable();
    }
    
    showMyReports() {
        // Filter to show only reports from today
        const today = new Date().toISOString().split('T')[0];
        this.filteredData = this.historyData.filter(item => item.date === today);
        this.renderHistoryTable();
        this.updateStatistics();
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderHistoryTable();
    }
    
    viewDetails(reportId) {
        const report = this.historyData.find(item => item.id === reportId);
        if (report) {
            alert(`تفصیلات:\n\nآئی ڈی: ${report.id}\nوقت: ${report.time}\nتاریخ: ${report.date}\nٹائپ: ${this.getTypeText(report.type)}\nلوکیشن: ${report.location}\nاسٹیٹس: ${this.getStatusText(report.status)}\nرسپانز ٹائم: ${report.responseTime} منٹ`);
        }
    }
    
    downloadReport(reportId) {
        const report = this.historyData.find(item => item.id === reportId);
        if (report) {
            const csvContent = `آئی ڈی,وقت,تاریخ,ٹائپ,لوکیشن,اسٹیٹس,رسپانز ٹائم,پرائرٹی\n${report.id},${report.time},${report.date},${this.getTypeText(report.type)},${report.location},${this.getStatusText(report.status)},${report.responseTime},${report.priority}`;
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `emergency_report_${reportId}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }
    
    exportHistory() {
        const csvContent = 'آئی ڈی,وقت,تاریخ,ٹائپ,لوکیشن,اسٹیٹس,رسپانز ٹائم,پرائرٹی\n' + 
            this.filteredData.map(item => 
                `${item.id},${item.time},${item.date},${this.getTypeText(item.type)},${item.location},${this.getStatusText(item.status)},${item.responseTime},${item.priority}`
            ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'emergency_history.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }
    
    changeLanguage(language) {
        this.currentLanguage = language;
        console.log('Language changed to:', language);
        this.updateUILanguage();
    }
    
    updateUILanguage() {
        const translations = {
            ur: {
                pageTitle: 'ہسٹری - پُکار',
                systemStatus: 'ہسٹری سسٹم',
                history: 'ایمرجنسی ہسٹری',
                totalReports: 'کل رپورٹس',
                completed: 'مکمل ہوئے',
                pending: 'زیر غور',
                active: 'فعال',
                detailedReports: 'تفصیلی رپورٹس',
                newest: 'تازہ ترین',
                oldest: 'قدیم ترین',
                myReports: 'میری رپورٹس',
                reportId: 'رپورٹ آئی ڈی',
                time: 'وقت',
                date: 'تاریخ',
                emergencyType: 'ایمرجنسی ٹائپ',
                location: 'لوکیشن',
                status: 'اسٹیٹس',
                responseTime: 'رسپانز ٹائم',
                actions: 'ایکشنز'
            },
            ps: {
                pageTitle: 'هسټري - پُکار',
                systemStatus: 'هسټري سيستم',
                history: 'ايمرجنسي هسټري',
                totalReports: 'ټول راپورټې',
                completed: 'مکمل شوي',
                pending: 'زير غور',
                active: 'فعال',
                detailedReports: 'تفصیلي راپورټې',
                newest: 'تازه ترين',
                oldest: 'زما ترين',
                myReports: 'زما راپورټې',
                reportId: 'راپورټ آی ډي',
                time: 'وخت',
                date: 'نېڍ',
                emergencyType: 'ايمرجنسي ډول',
                location: 'ځای',
                status: 'استاتوس',
                responseTime: 'رسپانز وخت',
                actions: 'کړنې'
            },
            sd: {
                pageTitle: 'هسٽري - پُکار',
                systemStatus: 'ايمرجنسي سسٽم',
                history: 'ايمرجنسي هسٽري',
                totalReports: 'ڪل رپورٽس',
                completed: 'مڪمل ٿيا',
                pending: 'زير غور',
                active: 'فعال',
                detailedReports: 'تفصيلي رپورٽس',
                newest: 'تازي ترين',
                oldest: 'قديم ترين',
                myReports: 'منهنجا رپورٽس',
                reportId: 'رپورٽ آئي ڊي',
                time: 'وقت',
                date: 'تاريخ',
                emergencyType: 'ايمرجنسي قسم',
                location: 'جاءِ',
                status: 'ستيٽس',
                responseTime: 'رسپانز وقت',
                actions: 'ڪارن'
            },
            sk: {
                pageTitle: 'ہسٹری - پُکار',
                systemStatus: 'ہسٹری سسٹم',
                history: 'ایمرجنسی ہسٹری',
                totalReports: 'کل رپورٹس',
                completed: 'مکمل ہوئے',
                pending: 'زیر غور',
                active: 'فعال',
                detailedReports: 'تفصیلی رپورٹس',
                newest: 'تازہ ترین',
                oldest: 'قدیم ترین',
                myReports: 'میرے رپورٹس',
                reportId: 'رپورٹ آئی ڈی',
                time: 'وقت',
                date: 'تاریخ',
                emergencyType: 'ایمرجنسی ٹائپ',
                location: 'لوکیشن',
                status: 'اسٹیٹس',
                responseTime: 'رسپانز ٹائم',
                actions: 'ایکشنز'
            }
        };
        
        const t = translations[this.currentLanguage] || translations.ur;
        
        // Update page title
        document.title = t.pageTitle;
        
        // Update status bar
        const statusText = document.querySelector('.status-left span:nth-child(2)');
        if (statusText) statusText.textContent = t.systemStatus;
        
        // Update main headings
        const historyHeading = document.querySelector('.dashboard-header h2');
        if (historyHeading) historyHeading.textContent = t.history;
        
        // Update statistics
        const statLabels = document.querySelectorAll('.stat-header h3');
        if (statLabels[0]) statLabels[0].textContent = t.totalReports;
        if (statLabels[1]) statLabels[1].textContent = t.completed;
        if (statLabels[2]) statLabels[2].textContent = t.pending;
        if (statLabels[3]) statLabels[3].textContent = t.active;
        
        // Update table headers
        const tableHeaders = document.querySelectorAll('.data-table th');
        if (tableHeaders[0]) tableHeaders[0].textContent = t.reportId;
        if (tableHeaders[1]) tableHeaders[1].textContent = t.time;
        if (tableHeaders[2]) tableHeaders[2].textContent = t.emergencyType;
        if (tableHeaders[3]) tableHeaders[3].textContent = t.location;
        if (tableHeaders[4]) tableHeaders[4].textContent = t.status;
        if (tableHeaders[5]) tableHeaders[5].textContent = t.responseTime;
        if (tableHeaders[6]) tableHeaders[6].textContent = t.actions;
        
        // Update table controls
        const tableBtns = document.querySelectorAll('.table-btn');
        if (tableBtns[0]) tableBtns[0].textContent = t.newest;
        if (tableBtns[1]) tableBtns[1].textContent = t.oldest;
        if (tableBtns[2]) tableBtns[2].textContent = t.myReports;
    }
}

// Initialize the system
document.addEventListener('DOMContentLoaded', () => {
    window.historySystem = new HistorySystem();
});
