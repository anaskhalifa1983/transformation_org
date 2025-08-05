// Performance Testing and Monitoring Script
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.observers = {};
        this.init();
    }

    init() {
        this.setupPerformanceObservers();
        this.setupResourceTiming();
        this.setupUserTiming();
        this.setupErrorTracking();
        this.setupMemoryMonitoring();
    }

    // Setup Performance Observers for Core Web Vitals
    setupPerformanceObservers() {
        // Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.lcp = lastEntry.startTime;
                    this.logMetric('LCP', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP observer not supported');
            }

            // First Input Delay (FID)
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.metrics.fid = entry.processingStart - entry.startTime;
                        this.logMetric('FID', this.metrics.fid);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID observer not supported');
            }

            // Cumulative Layout Shift (CLS)
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    this.metrics.cls = clsValue;
                    this.logMetric('CLS', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('CLS observer not supported');
            }

            // First Contentful Paint (FCP)
            try {
                const fcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const firstEntry = entries[0];
                    this.metrics.fcp = firstEntry.startTime;
                    this.logMetric('FCP', firstEntry.startTime);
                });
                fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });
            } catch (e) {
                console.warn('FCP observer not supported');
            }
        }
    }

    // Resource Timing API
    setupResourceTiming() {
        if ('performance' in window && 'getEntriesByType' in performance) {
            setTimeout(() => {
                const resources = performance.getEntriesByType('resource');
                const criticalResources = resources.filter(resource => 
                    resource.name.includes('.css') || 
                    resource.name.includes('.js') ||
                    resource.name.includes('.html')
                );

                criticalResources.forEach(resource => {
                    this.logMetric('Resource Load', {
                        name: resource.name,
                        duration: resource.duration,
                        size: resource.transferSize || 0
                    });
                });

                // Calculate total resource load time
                const totalLoadTime = criticalResources.reduce((sum, resource) => 
                    sum + resource.duration, 0
                );
                this.metrics.totalResourceLoadTime = totalLoadTime;
                this.logMetric('Total Resource Load Time', totalLoadTime);
            }, 1000);
        }
    }

    // User Timing API
    setupUserTiming() {
        // Mark important events
        performance.mark('app-init-start');
        
        // Measure app initialization
        document.addEventListener('DOMContentLoaded', () => {
            performance.mark('dom-content-loaded');
            performance.measure('DOM Content Loaded', 'app-init-start', 'dom-content-loaded');
            
            const measure = performance.getEntriesByName('DOM Content Loaded')[0];
            this.metrics.domContentLoaded = measure.duration;
            this.logMetric('DOM Content Loaded', measure.duration);
        });

        // Measure app ready
        window.addEventListener('load', () => {
            performance.mark('app-ready');
            performance.measure('App Ready', 'app-init-start', 'app-ready');
            
            const measure = performance.getEntriesByName('App Ready')[0];
            this.metrics.appReady = measure.duration;
            this.logMetric('App Ready', measure.duration);
        });
    }

    // Error Tracking
    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason
            });
        });
    }

    // Memory Monitoring
    setupMemoryMonitoring() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.metrics.memory = {
                    used: memory.usedJSHeapSize,
                    total: memory.totalJSHeapSize,
                    limit: memory.jsHeapSizeLimit
                };
                this.logMetric('Memory Usage', this.metrics.memory);
            }, 5000);
        }
    }

    // Service Worker Performance
    setupServiceWorkerMonitoring() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.ready.then(registration => {
                this.logMetric('Service Worker Status', 'Active');
                
                // Monitor service worker updates
                registration.addEventListener('updatefound', () => {
                    this.logMetric('Service Worker Update', 'Found');
                });
            }).catch(error => {
                this.logError('Service Worker Error', error);
            });
        }
    }

    // Cache Performance
    setupCacheMonitoring() {
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                this.logMetric('Cache Status', {
                    cacheCount: cacheNames.length,
                    cacheNames: cacheNames
                });
            });
        }
    }

    // Network Performance
    setupNetworkMonitoring() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.metrics.network = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
            this.logMetric('Network Info', this.metrics.network);
        }
    }

    // Log metrics with performance thresholds
    logMetric(name, value) {
        const timestamp = Date.now();
        const metric = {
            name,
            value,
            timestamp,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Store metric
        if (!this.metrics[name]) {
            this.metrics[name] = [];
        }
        this.metrics[name].push(metric);

        // Check performance thresholds
        this.checkPerformanceThresholds(name, value);

        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`📊 ${name}:`, value);
        }

        // Send to analytics (if configured)
        this.sendToAnalytics(metric);
    }

    // Check performance thresholds and warn if exceeded
    checkPerformanceThresholds(name, value) {
        const thresholds = {
            'FCP': { good: 1800, poor: 3000 },
            'LCP': { good: 2500, poor: 4000 },
            'FID': { good: 100, poor: 300 },
            'CLS': { good: 0.1, poor: 0.25 },
            'DOM Content Loaded': { good: 1000, poor: 2000 },
            'App Ready': { good: 2000, poor: 4000 }
        };

        const threshold = thresholds[name];
        if (threshold) {
            if (value > threshold.poor) {
                this.logError(`Performance Issue: ${name}`, {
                    value,
                    threshold: threshold.poor,
                    severity: 'poor'
                });
            } else if (value > threshold.good) {
                console.warn(`⚠️ ${name} needs improvement:`, value);
            }
        }
    }

    // Log errors
    logError(type, error) {
        const errorLog = {
            type,
            error,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        // Store error
        if (!this.metrics.errors) {
            this.metrics.errors = [];
        }
        this.metrics.errors.push(errorLog);

        // Log to console
        console.error(`❌ ${type}:`, error);

        // Send to error tracking (if configured)
        this.sendToErrorTracking(errorLog);
    }

    // Send metrics to analytics
    sendToAnalytics(metric) {
        // Example: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_metric', {
                metric_name: metric.name,
                metric_value: metric.value,
                page_location: metric.url
            });
        }

        // Example: Custom analytics endpoint
        // fetch('/api/analytics/performance', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(metric)
        // });
    }

    // Send errors to error tracking
    sendToErrorTracking(errorLog) {
        // Example: Sentry
        // if (typeof Sentry !== 'undefined') {
        //     Sentry.captureException(errorLog.error);
        // }

        // Example: Custom error tracking endpoint
        // fetch('/api/analytics/errors', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(errorLog)
        // });
    }

    // Get performance report
    getPerformanceReport() {
        const report = {
            timestamp: Date.now(),
            url: window.location.href,
            metrics: this.metrics,
            summary: this.generateSummary()
        };

        return report;
    }

    // Generate performance summary
    generateSummary() {
        const summary = {};
        
        // Core Web Vitals summary
        if (this.metrics.fcp) {
            summary.fcp = this.metrics.fcp[this.metrics.fcp.length - 1]?.value;
        }
        if (this.metrics.lcp) {
            summary.lcp = this.metrics.lcp[this.metrics.lcp.length - 1]?.value;
        }
        if (this.metrics.fid) {
            summary.fid = this.metrics.fid[this.metrics.fid.length - 1]?.value;
        }
        if (this.metrics.cls) {
            summary.cls = this.metrics.cls[this.metrics.cls.length - 1]?.value;
        }

        // Performance score calculation
        let score = 100;
        if (summary.fcp > 1800) score -= 10;
        if (summary.lcp > 2500) score -= 15;
        if (summary.fid > 100) score -= 10;
        if (summary.cls > 0.1) score -= 10;

        summary.performanceScore = Math.max(0, score);
        summary.grade = this.getGrade(summary.performanceScore);

        return summary;
    }

    // Get performance grade
    getGrade(score) {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    // Export metrics
    exportMetrics() {
        const report = this.getPerformanceReport();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-report-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // Display performance dashboard
    showDashboard() {
        const report = this.getPerformanceReport();
        const dashboard = document.createElement('div');
        dashboard.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: monospace;
            font-size: 12px;
        `;

        dashboard.innerHTML = `
            <h3>Performance Dashboard</h3>
            <p><strong>Score:</strong> ${report.summary.performanceScore}/100 (${report.summary.grade})</p>
            <p><strong>FCP:</strong> ${report.summary.fcp ? Math.round(report.summary.fcp) + 'ms' : 'N/A'}</p>
            <p><strong>LCP:</strong> ${report.summary.lcp ? Math.round(report.summary.lcp) + 'ms' : 'N/A'}</p>
            <p><strong>FID:</strong> ${report.summary.fid ? Math.round(report.summary.fid) + 'ms' : 'N/A'}</p>
            <p><strong>CLS:</strong> ${report.summary.cls ? report.summary.cls.toFixed(3) : 'N/A'}</p>
            <button onclick="performanceMonitor.exportMetrics()">Export Report</button>
            <button onclick="this.parentElement.remove()">Close</button>
        `;

        document.body.appendChild(dashboard);
    }
}

// Initialize performance monitor
const performanceMonitor = new PerformanceMonitor();

// Expose to global scope for debugging
window.performanceMonitor = performanceMonitor;

// Auto-show dashboard in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setTimeout(() => {
        performanceMonitor.showDashboard();
    }, 2000);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}