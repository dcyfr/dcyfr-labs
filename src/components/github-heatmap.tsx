"use client";

import { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Card } from "@/components/ui/card";
import "react-calendar-heatmap/dist/styles.css";

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionResponse {
  contributions: ContributionDay[];
  source?: string;
  totalContributions?: number;
  timestamp?: number;
  warning?: string;
}

interface GitHubHeatmapProps {
  username?: string;
}

const DEFAULT_GITHUB_USERNAME = "dcyfr";
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

export function GitHubHeatmap({ username = DEFAULT_GITHUB_USERNAME }: GitHubHeatmapProps) {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [warning, setWarning] = useState<string | null>(null);

  const cacheKey = `github-contributions-${username}`;

  useEffect(() => {
    const fetchContributions = async (): Promise<ContributionResponse> => {
      try {
        // Check for cached data first
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            const isExpired = cachedData.timestamp && (Date.now() - cachedData.timestamp > CACHE_DURATION);
            
            // If we have fresh cached data, use it
            if (!isExpired) {
              return {
                ...cachedData,
                source: 'cached'
              };
            }
          } catch {
            // Invalid cache, clear it
            localStorage.removeItem(cacheKey);
          }
        }

        // Try to fetch fresh data
        const response = await fetch(`/api/github-contributions?username=${username}`);
        
        if (response.ok) {
          const data: ContributionResponse = await response.json();
          // Cache successful response with timestamp
          const cacheData = {
            ...data,
            timestamp: Date.now()
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
          return data;
        } else {
          throw new Error(`API error: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching contributions:', error);
        
        // Check if we have any cached data (even if expired) before falling back to mock data
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          try {
            const cachedData = JSON.parse(cached);
            const isExpired = cachedData.timestamp && (Date.now() - cachedData.timestamp > CACHE_DURATION);
            
            setError(`Using ${isExpired ? 'expired cached' : 'cached'} data - API unavailable`);
            return {
              ...cachedData,
              source: `cached ${isExpired ? '(expired)' : ''}`
            };
          } catch {
            // Invalid cache, remove it and fall through to mock data
            localStorage.removeItem(cacheKey);
          }
        }
        
        // Final fallback to mock data
        throw error; // Let the useEffect handle the mock data generation
      }
    };

    const loadData = async () => {
      try {
        const data = await fetchContributions();
        setContributions(data.contributions || []);
        setDataSource(data.source || 'unknown');
        setTotalContributions(data.totalContributions || data.contributions?.length || 0);
        setWarning(data.warning || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contributions");
        setContributions([]);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    loadData();
  }, [cacheKey, username]);

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">GitHub Activity</h3>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-sm text-muted-foreground">Loading contributions...</div>
          </div>
        </div>
      </Card>
    );
  }

  if (error && contributions.length === 0) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Contribution Activity</h3>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              @{username}
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-sm text-muted-foreground mb-2">
              Unable to load contribution data
            </div>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm underline hover:text-foreground"
            >
              View activity on GitHub
            </a>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Contribution Activity</h3>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            @{username}
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        
        {warning && (
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-3 mb-4">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Demo Data</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  {warning} <a href="https://github.com/dcyfr/cyberdrew-dev/blob/main/GITHUB_SETUP.md" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900 dark:hover:text-yellow-100">Learn how to configure</a>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="text-sm text-muted-foreground mb-2">
            Using cached data • <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              View on GitHub
            </a>
          </div>
        )}

        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={contributions}
            classForValue={(value) => {
              if (!value || value.count === 0) {
                return 'color-empty';
              }
              if (value.count < 3) {
                return 'color-scale-1';
              }
              if (value.count < 6) {
                return 'color-scale-2';
              }
              if (value.count < 9) {
                return 'color-scale-3';
              }
              return 'color-scale-4';
            }}
            showWeekdayLabels={false}
            showMonthLabels={false}
            showOutOfRangeDays={true}
            gutterSize={4}
            />
            {totalContributions > 0 && (
                <div className="text-sm text-muted-foreground mt-6 text-center">
                    {totalContributions} contributions in the last year
                    {dataSource === 'mock-data' && <span className="text-yellow-600 dark:text-yellow-500"> (demo)</span>}
                </div>
            )}
        </div>

        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex items-center space-x-1 mx-4">
            <div className="w-2.5 h-2.5 bg-muted rounded-sm" />
            <div className="w-2.5 h-2.5 bg-green-200 dark:bg-green-900 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-green-400 dark:bg-green-700 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-green-600 dark:bg-green-500 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-green-800 dark:bg-green-300 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>
    </Card>
  );
}