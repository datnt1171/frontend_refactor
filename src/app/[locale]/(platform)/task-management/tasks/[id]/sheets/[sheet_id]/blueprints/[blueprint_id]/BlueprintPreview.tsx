'use client'
import React, { useState, useEffect, useRef } from 'react';
import type { SheetBlueprint, Blueprint } from '@/types';

interface WorkerConfig {
  x: number;
  y: number;
  rotation: number;
}

interface BoothSpot {
  spot: string | null;
  stepname: string;
}

interface BlueprintViewerProps {
  sheetBlueprint: SheetBlueprint;
  blueprint: Blueprint;
  language?: 'en' | 'vi' | 'zh_hant';
}

const BlueprintViewer: React.FC<BlueprintViewerProps> = ({
  sheetBlueprint,
  blueprint,
  language = 'en'
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [workerConfig, setWorkerConfig] = useState<Record<string, WorkerConfig>>({});
  const [svgDimensions, setSvgDimensions] = useState<{width: number, height: number}>({width: 0, height: 0});
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Extract SVG dimensions from viewBox or width/height attributes
  const extractSvgDimensions = (svgText: string): {width: number, height: number} => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (svgElement) {
      const viewBox = svgElement.getAttribute('viewBox');
      if (viewBox) {
        const [, , width, height] = viewBox.split(' ').map(Number);
        return { width: width ?? 800, height: height ?? 600 };
      }
      
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

  // Extract worker configurations from SVG
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

  // Load SVG from blueprint file_url
  const loadSvg = async (): Promise<void> => {
    try {
      const response = await fetch(blueprint.file_url);
      const svgText = await response.text();
      setSvgContent(svgText);
      
      const dimensions = extractSvgDimensions(svgText);
      setSvgDimensions(dimensions);
      
      const config = extractWorkerConfig(svgText);
      setWorkerConfig(config);
      
    } catch (error) {
      console.error('Failed to load SVG:', error);
    }
  };

  useEffect(() => {
    if (blueprint?.file_url) {
      loadSvg();
    }
  }, [blueprint?.file_url]);

  // Extract BoothSpot data from SheetBlueprint
  const extractBoothSpotsFromSheet = (): BoothSpot[] => {
    if (!sheetBlueprint?.finishing_sheet_detail?.rows) {
      return [];
    }

    return sheetBlueprint.finishing_sheet_detail.rows
      .filter(row => row.spot !== null && row.spot !== undefined)
      .map(row => {
        const spotValue = parseFloat(row.spot!);
        const normalizedSpot = Number.isInteger(spotValue) 
          ? spotValue.toString() 
          : row.spot!;
        
        return {
          spot: normalizedSpot,
          stepname: language === 'vi' ? row.stepname_vi : 
                   language === 'zh_hant' ? row.stepname_zh_hant : 
                   row.stepname_en
        };
      });
  };

  const currentBoothSpots = extractBoothSpotsFromSheet();

  // Get step name by spot ID
  const getStepNameBySpot = (spotId: string): string => {
    const spotNumber = spotId.replace('spot-', '');
    const boothSpot = currentBoothSpots.find(spot => spot.spot === spotNumber);
    return boothSpot?.stepname || '';
  };

  // Update SVG with text labels
  const updateSvgWithText = (): string => {
    if (!svgContent) return '';

    let updatedSvg = svgContent;
    
    // Make SVG responsive
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(updatedSvg, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    if (svgElement) {
      svgElement.setAttribute('width', '100%');
      svgElement.setAttribute('height', '100%');
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      if (!svgElement.getAttribute('viewBox')) {
        svgElement.setAttribute('viewBox', `0 0 ${svgDimensions.width} ${svgDimensions.height}`);
      }
      
      updatedSvg = new XMLSerializer().serializeToString(svgDoc);
    }
    
    // Remove existing text elements
    updatedSvg = updatedSvg.replace(/<text[^>]*data-spot-label="true"[^>]*>.*?<\/text>/g, '');
    
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

  const isLandscape = svgDimensions.width > svgDimensions.height;
  const aspectRatio = svgDimensions.width / svgDimensions.height;

  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold">{blueprint.name}</h2>
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
  );
};

export default BlueprintViewer;