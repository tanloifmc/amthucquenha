'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';

export interface TableRoomShape {
  id: number;
  code: string;
  name: string;
  shape: 'RECT' | 'CIRCLE';
  roomType: 'VIP' | 'HALL' | 'GARDEN';
  x: number;
  y: number;
  width: number;
  height: number;
  capacityMax: number;
  status: 'AVAILABLE' | 'HOLD' | 'CONFIRMED' | 'SEATED';
}

const STATUS_COLORS = {
  AVAILABLE: { fill: '#F5EFE6', stroke: '#C58940', text: '#231F20' },
  HOLD: { fill: '#FEEBC8', stroke: '#C05621', text: '#C05621' },
  CONFIRMED: { fill: '#F7EAEB', stroke: '#8B1D24', text: '#8B1D24' },
  SEATED: { fill: '#EAF5EC', stroke: '#2A7238', text: '#2A7238' },
};

interface FloorCanvasProps {
  tables: TableRoomShape[];
  onSelectTable?: (table: TableRoomShape) => void;
  selectedTableId?: number | null;
}

export default function FloorCanvas({
  tables,
  onSelectTable,
  selectedTableId,
}: FloorCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500, scale: 1 });

  // Tự động co giãn theo kích thước khung chứa (Responsive Canvas chống vỡ layout)
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Chuẩn thiết kế 1000px chiều rộng
        const scale = width / 1000;
        const height = Math.max(480, 600 * scale);
        setDimensions({ width, height, scale });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] overflow-hidden p-2 shadow-xs">
      {/* Thanh chú thích trạng thái bàn */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E2D9] px-2 text-xs flex-wrap gap-2">
        <span className="font-bold text-[#8B1D24]">Sơ Đồ Mặt Bằng Canvas (Konva 2D Engine)</span>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#F5EFE6] border border-[#C58940]" />
            <span>Còn trống</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#FEEBC8] border border-[#C05621]" />
            <span>Giữ chỗ (Hold)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#F7EAEB] border border-[#8B1D24]" />
            <span>Đã cọc tiệc</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-[#EAF5EC] border border-[#2A7238]" />
            <span>Đang phục vụ</span>
          </div>
        </div>
      </div>

      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scaleX={dimensions.scale}
        scaleY={dimensions.scale}
      >
        <Layer>
          {tables.map((table) => {
            const colors = STATUS_COLORS[table.status] || STATUS_COLORS.AVAILABLE;
            const isSelected = selectedTableId === table.id;

            if (table.shape === 'CIRCLE') {
              const radius = table.width / 2;
              return (
                <Group
                  key={table.id}
                  x={table.x + radius}
                  y={table.y + radius}
                  onClick={() => onSelectTable?.(table)}
                  onTap={() => onSelectTable?.(table)}
                >
                  <Circle
                    radius={radius}
                    fill={colors.fill}
                    stroke={isSelected ? '#8B1D24' : colors.stroke}
                    strokeWidth={isSelected ? 3 : 1.5}
                    shadowBlur={isSelected ? 10 : 2}
                    shadowColor="#000"
                    shadowOpacity={0.15}
                  />
                  <Text
                    text={table.name}
                    fontSize={11}
                    fontStyle="bold"
                    fill={colors.text}
                    align="center"
                    verticalAlign="middle"
                    offsetX={radius}
                    offsetY={6}
                    width={table.width}
                  />
                  <Text
                    text={`(${table.capacityMax}k)`}
                    fontSize={9}
                    fill="#6B5E55"
                    align="center"
                    offsetX={radius}
                    offsetY={-8}
                    width={table.width}
                  />
                </Group>
              );
            }

            // Bàn / Phòng chữ nhật
            return (
              <Group
                key={table.id}
                x={table.x}
                y={table.y}
                onClick={() => onSelectTable?.(table)}
                onTap={() => onSelectTable?.(table)}
              >
                <Rect
                  width={table.width}
                  height={table.height}
                  cornerRadius={8}
                  fill={colors.fill}
                  stroke={isSelected ? '#8B1D24' : colors.stroke}
                  strokeWidth={isSelected ? 3 : 1.5}
                  shadowBlur={isSelected ? 10 : 2}
                  shadowColor="#000"
                  shadowOpacity={0.15}
                />
                <Text
                  text={table.name}
                  fontSize={11}
                  fontStyle="bold"
                  fill={colors.text}
                  align="center"
                  verticalAlign="middle"
                  width={table.width}
                  y={table.height / 2 - 12}
                />
                <Text
                  text={`${table.roomType} • Tối đa ${table.capacityMax} khách`}
                  fontSize={9}
                  fill="#6B5E55"
                  align="center"
                  width={table.width}
                  y={table.height / 2 + 4}
                />
              </Group>
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}
