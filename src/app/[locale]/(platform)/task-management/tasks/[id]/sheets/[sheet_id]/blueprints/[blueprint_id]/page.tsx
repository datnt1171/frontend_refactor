'use client'
import React, { useState, useEffect, useRef } from 'react';

interface WorkerConfig {
  x: number;
  y: number;
  rotation: number;
}

interface BoothSpot {
  spot: string | null; // decimal values like 1, 2, 2.1, 3
  stepname: string;
}

// Mock function - replace with your actual implementation
const getBoothSpot = (): BoothSpot[] => {
  // This should be replaced with your actual data source
  return [
    { spot: "1", stepname: "Sanding" },
    { spot: "2", stepname: "Priming" },
    { spot: "2.1", stepname: "Base Coating" },
    { spot: "3", stepname: "Color Application" },
    { spot: "4", stepname: "Clear Coating" },
    { spot: "5", stepname: "Drying/Curing" }
  ];
};

const FurnitureCoatingBlueprint: React.FC = () => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [workerConfig, setWorkerConfig] = useState<Record<string, WorkerConfig>>({});
  const [availableSvgs] = useState<string[]>(['blueprint1.svg','blueprint2.svg','TBD2.svg','CT5.svg','CT6.svg','CT56.svg','TBD3.svg']);
  const [selectedSvg, setSelectedSvg] = useState<string>('blueprint2.svg');
  const [hideUnassigned, setHideUnassigned] = useState<boolean>(false);
  const [svgDimensions, setSvgDimensions] = useState<{width: number, height: number}>({width: 0, height: 0});
  const [boothSpots, setBoothSpots] = useState<BoothSpot[]>([]);
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Extract SVG dimensions from viewBox or width/height attributes
  const extractSvgDimensions = (svgText: string): {width: number, height: number} => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (svgElement) {
      // Try viewBox first
      const viewBox = svgElement.getAttribute('viewBox');
      if (viewBox) {
        const [, , width, height] = viewBox.split(' ').map(Number);
        return { width: width ?? 800, height: height ?? 600 };
      }
      
      // Fall back to width/height attributes
      const width = parseFloat(svgElement.getAttribute('width') || '800');
      const height = parseFloat(svgElement.getAttribute('height') || '600');
      return { width, height };
    }
    
    return { width: 800, height: 600 };
  };

  // Parse transform string to extract rotation
  const parseTransform = (transform: string): number => {
    if (!transform) return 0;
    
    const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
    if (rotateMatch) {
      const params = rotateMatch[1]?.split(',').map(p => parseFloat(p.trim())) || [];
      return params[0] || 0;
    }
    return 0;
  };

  // Extract worker configurations from SVG by finding elements with worker IDs
  const extractWorkerConfig = (svgText: string): Record<string, WorkerConfig> => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
    const extractedWorkers: Record<string, WorkerConfig> = {};
    
    const allElements = svgDoc.querySelectorAll('[data-cell-id^="spot-"]');
    const regularIdElements = svgDoc.querySelectorAll('[id^="spot-"]');
    const elementsToProcess = [...Array.from(allElements), ...Array.from(regularIdElements)];

    elementsToProcess.forEach((element) => {
      const workerId = element.getAttribute('data-cell-id') || element.id;
      let shapeElement = element.querySelector('rect, circle, ellipse, polygon, path');
      
      if (!shapeElement && (element.tagName === 'rect' || element.tagName === 'circle' || element.tagName === 'ellipse')) {
        shapeElement = element;
      }
      
      if (shapeElement) {
        let x = 0, y = 0, width = 0, height = 0;
        
        if (shapeElement.tagName === 'rect') {
          x = parseFloat(shapeElement.getAttribute('x') || '0');
          y = parseFloat(shapeElement.getAttribute('y') || '0');
          width = parseFloat(shapeElement.getAttribute('width') || '0');
          height = parseFloat(shapeElement.getAttribute('height') || '0');
        } else if (shapeElement.tagName === 'circle') {
          const cx = parseFloat(shapeElement.getAttribute('cx') || '0');
          const cy = parseFloat(shapeElement.getAttribute('cy') || '0');
          const r = parseFloat(shapeElement.getAttribute('r') || '0');
          x = cx - r;
          y = cy - r;
          width = r * 2;
          height = r * 2;
        }
        
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        
        const elementTransform = shapeElement.getAttribute('transform') || '';
        const parentTransform = element.getAttribute('transform') || '';
        const combinedTransform = elementTransform + ' ' + parentTransform;
        const rotation = parseTransform(combinedTransform);
        
        extractedWorkers[workerId] = {
          x: centerX,
          y: centerY,
          rotation: rotation,
        };
      }
    });

    return extractedWorkers;
  };

  // Load SVG and extract worker configurations
  const loadSvg = async (svgFileName: string): Promise<void> => {
    try {
      const response = await fetch(`/${svgFileName}`);
      const svgText = await response.text();
      setSvgContent(svgText);
      
      // Extract dimensions
      const dimensions = extractSvgDimensions(svgText);
      setSvgDimensions(dimensions);
      
      const config = extractWorkerConfig(svgText);
      setWorkerConfig(config);
      
    } catch (error) {
      console.error('Failed to load SVG:', error);
    }
  };

  // Load booth spot data
  const loadBoothSpotData = (): void => {
    const data = getBoothSpot();
    setBoothSpots(data);
  };

  useEffect(() => {
    loadSvg(selectedSvg);
  }, [selectedSvg]);

  useEffect(() => {
    loadBoothSpotData();
  }, []);

  // Create a map from spot number to step name for easy lookup
  const getStepNameBySpot = (spotId: string): string => {
    // Extract numeric part from spot ID (e.g., "spot-1" -> "1", "spot-2.1" -> "2.1")
    const spotNumber = spotId.replace('spot-', '');
    const boothSpot = boothSpots.find(spot => spot.spot === spotNumber);
    return boothSpot?.stepname || '';
  };

  // Update SVG with responsive viewBox and text labels
  const updateSvgWithText = (): string => {
    if (!svgContent) return '';

    let updatedSvg = svgContent;
    
    // Ensure SVG is responsive by setting viewBox and removing fixed dimensions
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(updatedSvg, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (svgElement) {
      // Set responsive attributes
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      // Ensure viewBox exists
      if (!svgElement.getAttribute('viewBox')) {
        svgElement.setAttribute('viewBox', `0 0 ${svgDimensions.width} ${svgDimensions.height}`);
      }
      
      updatedSvg = new XMLSerializer().serializeToString(svgDoc);
    }
    
    // Remove existing text elements
    updatedSvg = updatedSvg.replace(/<text[^>]*data-spot-label="true"[^>]*>.*?<\/text>/g, '');
    
    // Handle hiding unassigned workers
    if (hideUnassigned) {
      Object.keys(workerConfig).forEach((workerId) => {
        const stepName = getStepNameBySpot(workerId);
        const hasStep = stepName.trim() !== '';
        
        if (!hasStep) {
          const workerGroupRegex = new RegExp(`(<g[^>]*data-cell-id="${workerId}"[^>]*)(>)`, 'g');
          updatedSvg = updatedSvg.replace(workerGroupRegex, '$1 style="opacity:0.2"$2');
        }
      });
    }
    
    // Add text elements based on booth spot data
    Object.keys(workerConfig).forEach((workerId) => {
      const stepName = getStepNameBySpot(workerId);
      
      if (stepName.trim() && workerConfig[workerId]) {
        const config = workerConfig[workerId];
        const textElement = `<text x="${config.x}" y="${config.y + 4}" fill="black" font-size="12" font-weight="bold" text-anchor="middle" transform="rotate(${config.rotation},${config.x},${config.y})" data-spot-label="true">${stepName}</text>`;
        updatedSvg = updatedSvg.replace('</svg>', `${textElement}</svg>`);
      }
    });
    
    return updatedSvg;
  };

  const toggleHideUnassigned = (): void => {
    setHideUnassigned(prev => !prev);
  };

  const handlePrint = (): void => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const svgToPrint = updateSvgWithText();
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Furniture Coating Blueprint</title>
          <style>
            body {
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .blueprint-container {
              text-align: center;
            }
            .blueprint-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 20px;
            }
            .blueprint-svg {
              border: 1px solid #ccc;
              background: #f9f9f9;
              width: 100%;
              max-width: 100%;
            }
            @media print {
              body { margin: 0; }
              .blueprint-container { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="blueprint-container">
            <div class="blueprint-title">Furniture Coating Blueprint - ${selectedSvg}</div>
            <div class="blueprint-svg">${svgToPrint}</div>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handleSvgChange = (newSvg: string): void => {
    setSelectedSvg(newSvg);
  };

  const refreshData = (): void => {
    loadBoothSpotData();
  };

  // Determine if SVG is landscape or portrait
  const isLandscape = svgDimensions.width > svgDimensions.height;
  const aspectRatio = svgDimensions.width / svgDimensions.height;

  // Get count of assigned spots
  const assignedSpotsCount = Object.keys(workerConfig).filter(workerId => {
    const stepName = getStepNameBySpot(workerId);
    return stepName.trim() !== '';
  }).length;

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-4 p-4">
      {/* Control Panel - Simplified */}
      <div className="lg:w-64 w-full flex-shrink-0">
        <div className="bg-white rounded-lg shadow-lg p-4 h-fit">
          <h1 className="text-lg font-bold mb-4 text-center">Blueprint Viewer</h1>
          
          <div className="mb-4">
            <label className="block font-medium mb-2 text-sm">Blueprint:</label>
            <select
              value={selectedSvg}
              onChange={(e) => handleSvgChange(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableSvgs.map(svg => (
                <option key={svg} value={svg}>{svg}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-600 mb-1">Assigned Spots:</div>
            <div className="text-lg font-semibold">{assignedSpotsCount} / {Object.keys(workerConfig).length}</div>
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={refreshData}
              className="w-full px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Refresh Data
            </button>
            
            <button
              onClick={handlePrint}
              className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Print Blueprint
            </button>
            
            <button
              onClick={toggleHideUnassigned}
              className={`w-full px-3 py-2 text-sm rounded transition-colors ${
                hideUnassigned 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              {hideUnassigned ? 'Show All Spots' : 'Hide Unassigned'}
            </button>
          </div>
        </div>
      </div>

      {/* Blueprint Display - Takes remaining space */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h2 className="text-xl font-semibold">Blueprint View</h2>
            <div className="text-sm text-gray-500">
              {svgDimensions.width} × {svgDimensions.height} 
              ({isLandscape ? 'Landscape' : 'Portrait'})
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-2">
            <div 
              ref={svgContainerRef}
              className="border border-gray-300 rounded bg-gray-50 shadow-sm"
              style={{
                width: isLandscape ? 'auto' : '100%',
                height: isLandscape ? '100%' : 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: aspectRatio > 0 ? `${svgDimensions.width}/${svgDimensions.height}` : '1'
              }}
            >
              <div 
                className="w-full h-full p-2"
                dangerouslySetInnerHTML={{ __html: updateSvgWithText() }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureCoatingBlueprint;