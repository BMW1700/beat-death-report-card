import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Globe, 
  MapPin, 
  Shield, 
  Mountain, 
  Home, 
  Users, 
  Plus,
  X,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface SurvivalPin {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  type: 'shelter' | 'hiking' | 'water' | 'medical' | 'bunker';
  votes: number;
  addedBy: string;
  addedAt: Date;
}

const PIN_TYPES = {
  shelter: { icon: Home, color: '#10b981', label: 'Safe Shelter' },
  hiking: { icon: Mountain, color: '#f59e0b', label: 'Hiking/Exercise' },
  water: { icon: Globe, color: '#3b82f6', label: 'Water Source' },
  medical: { icon: Plus, color: '#ef4444', label: 'Medical Facility' },
  bunker: { icon: Shield, color: '#8b5cf6', label: 'Bunker/Fortress' }
};

const SurvivalistMapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [survivalPins, setSurvivalPins] = useState<SurvivalPin[]>([]);
  const [showAddPin, setShowAddPin] = useState(false);
  const [newPin, setNewPin] = useState({
    title: '',
    description: '',
    type: 'shelter' as keyof typeof PIN_TYPES,
    lat: 0,
    lng: 0
  });
  const [liveDeathCount, setLiveDeathCount] = useState(0);

  // Simulate live death count
  useEffect(() => {
    const startCount = 168000; // Deaths per day globally
    const interval = setInterval(() => {
      setLiveDeathCount(prev => prev + 1);
    }, 514); // ~168,000 deaths/day = 1 death every 514ms

    setLiveDeathCount(startCount);
    return () => clearInterval(interval);
  }, []);

  // Sample survival pins
  useEffect(() => {
    setSurvivalPins([
      {
        id: '1',
        lat: 40.7829,
        lng: -73.9654,
        title: 'Central Park Emergency Shelter',
        description: 'Large open space with multiple exit routes and water access',
        type: 'shelter',
        votes: 142,
        addedBy: 'UrbanSurvivor',
        addedAt: new Date()
      },
      {
        id: '2', 
        lat: 46.8772,
        lng: -121.7269,
        title: 'Mount Rainier High Ground',
        description: 'High elevation, fresh water streams, hunting opportunities',
        type: 'hiking',
        votes: 89,
        addedBy: 'MountainMan',
        addedAt: new Date()
      },
      {
        id: '3',
        lat: 39.0968,
        lng: -108.5506,
        title: 'Cheyenne Mountain Complex',
        description: 'Nuclear bunker facility, ultimate protection',
        type: 'bunker',
        votes: 234,
        addedBy: 'BunkerKing',
        addedAt: new Date()
      },
      {
        id: '4',
        lat: 64.0685,
        lng: -21.9422,
        title: 'Iceland Geothermal Zone',
        description: 'Natural hot springs, renewable energy, isolated location',
        type: 'water',
        votes: 156,
        addedBy: 'NordicNomad',
        addedAt: new Date()
      }
    ]);
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe',
      zoom: 2,
      center: [0, 20],
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(30, 30, 40)',
        'high-color': 'rgb(50, 50, 60)',
        'horizon-blend': 0.1,
      });
    });

    // Add click handler for adding pins
    map.current.on('click', (e) => {
      if (showAddPin) {
        setNewPin(prev => ({
          ...prev,
          lat: e.lngLat.lat,
          lng: e.lngLat.lng
        }));
      }
    });

    setShowTokenInput(false);
  };

  // Add pins to map
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.survival-marker');
    existingMarkers.forEach(marker => marker.remove());

    survivalPins.forEach(pin => {
      const el = document.createElement('div');
      el.className = 'survival-marker';
      el.style.cssText = `
        width: 30px;
        height: 30px;
        background: ${PIN_TYPES[pin.type].color};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;

      const Icon = PIN_TYPES[pin.type].icon;
      el.innerHTML = `<svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${pin.title}</h3>
          <p class="text-xs text-gray-600 mb-2">${pin.description}</p>
          <div class="flex items-center justify-between text-xs">
            <span class="px-2 py-1 bg-gray-100 rounded">${PIN_TYPES[pin.type].label}</span>
            <span class="text-green-600">👍 ${pin.votes}</span>
          </div>
          <div class="text-xs text-gray-500 mt-1">by ${pin.addedBy}</div>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([pin.lng, pin.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [survivalPins, map.current]);

  const handleAddPin = () => {
    if (!newPin.title || !newPin.description) {
      toast.error("Please fill in all fields");
      return;
    }

    const pin: SurvivalPin = {
      id: Date.now().toString(),
      ...newPin,
      votes: 1,
      addedBy: 'Anonymous',
      addedAt: new Date()
    };

    setSurvivalPins(prev => [...prev, pin]);
    setNewPin({ title: '', description: '', type: 'shelter', lat: 0, lng: 0 });
    setShowAddPin(false);
    
    toast.success("🗺️ Survival location added!", {
      description: "Your pin has been added to the global survival map!"
    });
  };

  if (showTokenInput) {
    return (
      <div className="min-h-screen pt-16 gradient-secondary-bg flex items-center justify-center">
        <Card className="glass-card border-primary/20 p-8 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text flex items-center justify-center gap-2">
              <Globe className="w-6 h-6" />
              Global Survivalist Map
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm text-center">
              Enter your Mapbox public token to view the interactive survival map
            </p>
            <Input
              placeholder="Mapbox Public Token (pk.)"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono text-xs"
            />
            <Button 
              onClick={initializeMap}
              disabled={!mapboxToken.startsWith('pk.')}
              className="w-full gradient-bg"
            >
              Load Survival Map
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Get your token at{' '}
              <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                mapbox.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 gradient-secondary-bg">
      {/* Live Death Counter */}
      <div className="fixed top-20 left-4 z-10">
        <Card className="glass-card border-destructive/30 destructive-glow">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Global Deaths Today</div>
              <div className="text-2xl font-bold text-destructive">
                {liveDeathCount.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">and counting...</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="fixed top-20 right-4 z-10 space-y-2">
        <Card className="glass-card border-primary/20">
          <CardContent className="p-4">
            <div className="text-center mb-3">
              <div className="text-sm font-semibold text-foreground">Survival Locations</div>
              <div className="text-xs text-muted-foreground">{survivalPins.length} pins added</div>
            </div>
            
            <Button
              onClick={() => setShowAddPin(!showAddPin)}
              size="sm"
              className={`w-full ${showAddPin ? 'bg-destructive hover:bg-destructive/90' : 'gradient-bg'}`}
            >
              {showAddPin ? (
                <>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-1" />
                  Add Location
                </>
              )}
            </Button>

            {showAddPin && (
              <div className="mt-3 space-y-2">
                <div className="text-xs text-warning flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Click map to place pin
                </div>
                <Input
                  placeholder="Location name"
                  value={newPin.title}
                  onChange={(e) => setNewPin(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Why is this a good survival spot?"
                  value={newPin.description}
                  onChange={(e) => setNewPin(prev => ({ ...prev, description: e.target.value }))}
                  className="text-xs"
                  rows={2}
                />
                <select
                  value={newPin.type}
                  onChange={(e) => setNewPin(prev => ({ ...prev, type: e.target.value as keyof typeof PIN_TYPES }))}
                  className="w-full p-1 text-xs rounded bg-background border border-border"
                >
                  {Object.entries(PIN_TYPES).map(([key, type]) => (
                    <option key={key} value={key}>{type.label}</option>
                  ))}
                </select>
                <Button
                  onClick={handleAddPin}
                  size="sm"
                  className="w-full gradient-bg"
                  disabled={!newPin.lat || !newPin.lng || !newPin.title}
                >
                  Add Pin
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="glass-card border-primary/20">
          <CardContent className="p-3">
            <div className="text-xs font-semibold text-foreground mb-2">Legend</div>
            <div className="space-y-1">
              {Object.entries(PIN_TYPES).map(([key, type]) => {
                const Icon = type.icon;
                return (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: type.color }}
                    >
                      <Icon className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-muted-foreground">{type.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Container */}
      <div className="h-screen">
        <div ref={mapContainer} className="absolute inset-0" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5" />
      </div>

      {/* Info Panel */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:w-80 z-10">
        <Card className="glass-card border-success/30 success-glow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-success flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Global Survival Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Collaborative mapping of the world's best survival locations. Click pins to see community recommendations.
            </p>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span className="text-muted-foreground">
                  {survivalPins.reduce((acc, pin) => acc + pin.votes, 0)} community votes
                </span>
              </div>
              <Badge className="bg-success/20 text-success border-success/30">
                LIVE MAP
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurvivalistMapPage;