import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Users, 
  Zap, 
  Activity, 
  Shield, 
  Download, 
  Upload,
  Cpu,
  Waves,
  Network
} from 'lucide-react';

interface NeuralConnection {
  id: string;
  username: string;
  compatibility: number;
  status: 'connected' | 'syncing' | 'idle';
  lastSync: string;
  sharedSkills: string[];
}

interface BrainMetrics {
  cognitivePower: number;
  memoryCapacity: number;
  processingSpeed: number;
  neuralStability: number;
}

export const Dashboard = () => {
  const [connections, setConnections] = useState<NeuralConnection[]>([
    {
      id: '1',
      username: 'Dr. Sarah Chen',
      compatibility: 94,
      status: 'connected',
      lastSync: '2 min ago',
      sharedSkills: ['Quantum Physics', 'Mathematics', 'Pattern Recognition']
    },
    {
      id: '2', 
      username: 'Marcus Tech',
      compatibility: 87,
      status: 'syncing',
      lastSync: '5 min ago',
      sharedSkills: ['Programming', 'AI Development', 'System Architecture']
    },
    {
      id: '3',
      username: 'Elena Artist',
      compatibility: 76,
      status: 'idle',
      lastSync: '1 hour ago',
      sharedSkills: ['Visual Arts', 'Creative Thinking', 'Design Principles']
    }
  ]);

  const [brainMetrics, setBrainMetrics] = useState<BrainMetrics>({
    cognitivePower: 78,
    memoryCapacity: 85,
    processingSpeed: 92,
    neuralStability: 96
  });

  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBrainMetrics(prev => ({
        ...prev,
        cognitivePower: Math.max(50, Math.min(100, prev.cognitivePower + (Math.random() - 0.5) * 4)),
        processingSpeed: Math.max(50, Math.min(100, prev.processingSpeed + (Math.random() - 0.5) * 3))
      }));
      
      if (connections.some(c => c.status === 'syncing')) {
        setSyncProgress(prev => (prev + 2) % 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [connections]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-primary';
      case 'syncing': return 'bg-accent';
      case 'idle': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  const initiateSync = (connectionId: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, status: 'syncing' as const, lastSync: 'syncing...' }
          : conn
      )
    );
    setSyncProgress(0);
  };

  return (
    <div className="min-h-screen bg-background neural-grid">
      {/* Header */}
      <div className="border-b border-primary/20 bg-card/30 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-primary to-secondary">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  NeuroSync
                </h1>
                <p className="text-sm text-muted-foreground">Neural Synchronization Platform 2050</p>
              </div>
            </div>
            <Badge variant="outline" className="border-primary/50 text-primary">
              <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
              Neural Interface Active
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Brain Metrics */}
          <div className="lg:col-span-1">
            <Card className="neural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Neural Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Cognitive Power</span>
                      <span className="text-sm text-primary">{brainMetrics.cognitivePower}%</span>
                    </div>
                    <Progress value={brainMetrics.cognitivePower} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Memory Capacity</span>
                      <span className="text-sm text-primary">{brainMetrics.memoryCapacity}%</span>
                    </div>
                    <Progress value={brainMetrics.memoryCapacity} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Processing Speed</span>
                      <span className="text-sm text-primary">{brainMetrics.processingSpeed}%</span>
                    </div>
                    <Progress value={brainMetrics.processingSpeed} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Neural Stability</span>
                      <span className="text-sm text-primary">{brainMetrics.neuralStability}%</span>
                    </div>
                    <Progress value={brainMetrics.neuralStability} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Security Level</span>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary">Quantum Encrypted</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="neural-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full neural-button">
                  <Download className="w-4 h-4 mr-2" />
                  Download Skills
                </Button>
                <Button className="w-full neural-button">
                  <Upload className="w-4 h-4 mr-2" />
                  Share Experience
                </Button>
                <Button className="w-full neural-button">
                  <Network className="w-4 h-4 mr-2" />
                  Find Compatible Minds
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Neural Connections */}
          <div className="lg:col-span-2">
            <Card className="neural-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Active Neural Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connections.map((connection) => (
                    <div key={connection.id} className="p-4 rounded-lg bg-muted/50 border border-primary/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                              <Brain className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(connection.status)}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{connection.username}</h3>
                            <p className="text-sm text-muted-foreground">
                              Compatibility: {connection.compatibility}% • {connection.lastSync}
                            </p>
                          </div>
                        </div>
                        <Button 
                          onClick={() => initiateSync(connection.id)}
                          disabled={connection.status === 'syncing'}
                          size="sm"
                          className="neural-button"
                        >
                          {connection.status === 'syncing' ? (
                            <>
                              <Waves className="w-4 h-4 mr-2 animate-pulse" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <Cpu className="w-4 h-4 mr-2" />
                              Sync
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {connection.status === 'syncing' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Neural Sync Progress</span>
                            <span>{syncProgress}%</span>
                          </div>
                          <Progress value={syncProgress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {connection.sharedSkills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="border-primary/50 text-primary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-primary/20">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-consciousness flex items-center justify-center">
                      <Brain className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Neural Network Status</h3>
                    <p className="text-muted-foreground mb-4">
                      Connected to {connections.length} compatible consciousness streams
                    </p>
                    <div className="synapse-line mb-4" />
                    <Button className="neural-button">
                      <Network className="w-4 h-4 mr-2" />
                      Expand Neural Network
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};