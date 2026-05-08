/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  Trophy, 
  Play, 
  Pause, 
  Info, 
  Settings2,
  ChevronRight,
  ChevronLeft,
  Timer,
  Hash,
  LayoutGrid
} from 'lucide-react';

// --- Constants & Types ---

type TowerIndex = 0 | 1 | 2;
const DISK_COLORS = [
  '#FF595E', // Red-ish
  '#FF924C', // Orange
  '#FFCA3A', // Yellow
  '#C5CA30', // Lime
  '#8AC926', // Green
  '#52A675', // Seafoam
  '#1982C4', // Blue
  '#6A4C93', // Purple
];

const MIN_DISKS = 3;
const MAX_DISKS = 8;

// --- Components ---

interface DiskProps {
  size: number;
  totalDisks: number;
  towerHeight: number;
  index: number;
  color: string;
  isSelected?: boolean;
}

const Disk: React.FC<DiskProps> = ({ size, totalDisks, towerHeight, index, color, isSelected }) => {
  // Width grows with size
  const width = `${25 + (size / totalDisks) * 65}%`;
  
  return (
    <motion.div
      layoutId={`disk-${size}`}
      className="absolute left-1/2 -translate-x-1/2 rounded-full border-3 border-black shadow-retro-small flex items-center justify-center font-display font-bold text-xs"
      style={{
        width,
        height: '32px',
        backgroundColor: color,
        bottom: `${index * 36}px`,
        zIndex: 10 + size,
      }}
      initial={false}
      animate={{
        y: isSelected ? -40 : 0,
        scale: isSelected ? 1.05 : 1,
        rotate: isSelected ? [0, -1, 1, 0] : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        rotate: isSelected ? { repeat: Infinity, duration: 0.5 } : { duration: 0.2 }
      }}
    >
      <span className="opacity-40">{size}</span>
    </motion.div>
  );
};

interface TowerProps {
  index: TowerIndex;
  disks: number[];
  totalDisks: number;
  isSelected: boolean;
  onSelect: (index: TowerIndex) => void;
  isValidTarget: boolean;
}

const Tower: React.FC<TowerProps> = ({ 
  index, 
  disks, 
  totalDisks, 
  isSelected, 
  onSelect,
  isValidTarget 
}) => {
  return (
    <div 
      className="relative flex-1 flex flex-col items-center justify-end h-[320px] cursor-pointer group"
      onClick={() => onSelect(index)}
    >
      {/* Target Indicator */}
      <AnimatePresence>
        {isValidTarget && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-8 bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-200 uppercase tracking-widest"
          >
            Valid
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Pole */}
      <div 
        className={`absolute bottom-0 w-3 h-[240px] rounded-t-full border-x-3 border-t-3 border-black transform transition-colors duration-300 ${
          isSelected ? 'bg-primary-500' : 'bg-gray-200 group-hover:bg-gray-300'
        }`} 
      />
      
      {/* The Base */}
      <div className="w-full h-4 bg-gray-800 rounded-lg border-2 border-black shadow-retro-small z-0" />

      {/* The Disks */}
      <div className="absolute bottom-4 w-full h-full flex flex-col-reverse items-center pointer-events-none">
        {disks.map((size, idx) => (
          <Disk 
            key={size}
            size={size}
            totalDisks={totalDisks}
            towerHeight={totalDisks}
            index={idx}
            color={DISK_COLORS[size - 1]}
            isSelected={isSelected && idx === disks.length - 1}
          />
        ))}
      </div>

      {/* Interaction Surface */}
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${isSelected ? 'bg-blue-50/30' : 'opacity-0'}`} />
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [diskCount, setDiskCount] = useState(3);
  const [towers, setTowers] = useState<number[][]>([[], [], []]);
  const [selectedTower, setSelectedTower] = useState<TowerIndex | null>(null);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Initialize Game
  const resetGame = useCallback(() => {
    const initialTowers: number[][] = [
      Array.from({ length: diskCount }, (_, i) => diskCount - i),
      [],
      []
    ];
    setTowers(initialTowers);
    setSelectedTower(null);
    setMoves(0);
    setIsWon(false);
    setTime(0);
    setIsActive(false);
  }, [diskCount]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !isWon) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isWon]);

  const handleTowerClick = (towerIndex: TowerIndex) => {
    if (isWon) return;

    if (!isActive && towers[0].length === diskCount) {
      setIsActive(true);
    }

    if (selectedTower === null) {
      // Picking up a disk
      if (towers[towerIndex].length > 0) {
        setSelectedTower(towerIndex);
      }
    } else {
      // Placing a disk
      if (selectedTower === towerIndex) {
        // Deselect if clicking the same tower
        setSelectedTower(null);
        return;
      }

      const sourceTower = [...towers[selectedTower]];
      const targetTower = [...towers[towerIndex]];
      const movingDisk = sourceTower[sourceTower.length - 1];
      const targetTopDisk = targetTower[targetTower.length - 1];

      // Validate Move
      if (!targetTopDisk || movingDisk < targetTopDisk) {
        sourceTower.pop();
        targetTower.push(movingDisk);

        const newTowers = [...towers];
        newTowers[selectedTower] = sourceTower;
        newTowers[towerIndex] = targetTower;

        setTowers(newTowers);
        setMoves((m) => m + 1);
        setSelectedTower(null);

        // Check Win Condition (All disks on middle or right tower)
        if (targetTower.length === diskCount && towerIndex !== 0) {
          setIsWon(true);
          setIsActive(false);
        }
      } else {
        // Invalid move - shake or feedback
        setSelectedTower(null);
      }
    }
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMinMoves = (n: number) => Math.pow(2, n) - 1;

  const isValidMove = (toIndex: TowerIndex): boolean => {
    if (selectedTower === null) return false;
    if (selectedTower === toIndex) return false;
    const movingDisk = towers[selectedTower][towers[selectedTower].length - 1];
    const targetTopDisk = towers[toIndex][towers[toIndex].length - 1];
    return !targetTopDisk || movingDisk < targetTopDisk;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-[#FDFCFB]">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none"
            >
              Tower <span className="text-blue-600">Odyssey</span>
            </motion.h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Info size={16} /> Stack them correctly on another peg.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-4 rounded-2xl shadow-retro flex gap-8">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest opacity-60 flex items-center justify-center gap-1">
                  <Hash size={10} /> Moves
                </div>
                <div className="text-2xl font-bold font-display">{moves}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest opacity-60 flex items-center justify-center gap-1">
                  <Timer size={10} /> Time
                </div>
                <div className="text-2xl font-bold font-display">{formatTime(time)}</div>
              </div>
            </div>
            
            <button 
              onClick={resetGame}
              className="p-4 bg-white border-3 border-black shadow-retro rounded-2xl hover:bg-gray-50 active:translate-y-1 active:shadow-none transition-all"
            >
              <RotateCcw size={24} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative bg-white border-3 border-black rounded-[40px] shadow-retro p-8 pt-16 overflow-hidden">
          {/* Difficulty Selector Overlay */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-gray-100 p-1.5 rounded-full border-2 border-black/10">
            <button 
              disabled={diskCount <= MIN_DISKS || isActive}
              onClick={() => setDiskCount(d => d - 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white border shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2 px-1">
              <Settings2 size={14} className="text-gray-400" />
              <span className="font-display font-bold text-sm w-16 text-center">
                {diskCount} Disks
              </span>
            </div>
            <button 
              disabled={diskCount >= MAX_DISKS || isActive}
              onClick={() => setDiskCount(d => d + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white border shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex justify-between items-end gap-4 mt-8">
            {towers.map((disks: number[], i: number) => (
              <Tower 
                key={i}
                index={i as TowerIndex}
                disks={disks}
                totalDisks={diskCount}
                isSelected={selectedTower === i}
                onSelect={handleTowerClick}
                isValidTarget={isValidMove(i as TowerIndex)}
              />
            ))}
          </div>

          {/* Win Announcement */}
          <AnimatePresence>
            {isWon && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="w-24 h-24 bg-yellow-400 border-4 border-black rounded-3xl shadow-retro flex items-center justify-center mb-6"
                >
                  <Trophy size={48} className="text-black" />
                </motion.div>
                
                <h2 className="text-6xl font-black uppercase tracking-tighter mb-2">Masterpiece!</h2>
                <div className="space-y-4 max-w-sm">
                  <p className="text-gray-600 font-medium text-lg">
                    You conquered the tower in <span className="text-black font-bold">{moves} moves</span> and <span className="text-black font-bold">{formatTime(time)}</span>.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Theoretical Minimum</p>
                    <p className="font-bold text-xl">{getMinMoves(diskCount)} moves</p>
                  </div>

                  <button 
                    onClick={resetGame}
                    className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl border-b-6 border-blue-800 active:border-b-0 active:translate-y-2 transition-all hover:bg-blue-500"
                  >
                    Play Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer Info */}
        <footer className="flex flex-col md:flex-row gap-6 text-sm">
          <div className="flex-1 bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 space-y-2">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <LayoutGrid size={16} /> Objective
            </h3>
            <p className="text-blue-700 leading-relaxed">
              Move all disks from the leftmost peg to either the center or rightmost peg. You can only move one disk at a time, and a larger disk can never be placed on top of a smaller one.
            </p>
          </div>
          
          <div className="md:w-64 bg-gray-100 p-6 rounded-3xl border-2 border-gray-200 flex flex-col justify-center">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="font-medium">Difficulty</span>
              <span className="font-bold">{diskCount} Disks</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-black h-full transition-all duration-500" 
                style={{ width: `${(diskCount / MAX_DISKS) * 100}%` }}
              />
            </div>
          </div>
        </footer>
      </div>

      {/* Background Decals */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03] overflow-hidden">
        <div className="absolute top-10 left-10 text-[20vw] font-black rotate-12">TOWER</div>
        <div className="absolute bottom-10 right-10 text-[20vw] font-black -rotate-12">ODYSSEY</div>
      </div>
    </div>
  );
}
