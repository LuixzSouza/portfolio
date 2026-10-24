"use client";

import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  ExternalLink,
  Eye,
  EyeOff,
  FolderGit2,
  Layers,
  Quote,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export interface PreviewData {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  published?: boolean;
  url?: string;
  tags?: string[];
  date?: string;
  status?: "draft" | "published" | "archived";
}

type PreviewType = "project" | "certificate" | "testimonial" | "service" | "generic";

interface PreviewCardProps {
  data: PreviewData;
  type?: PreviewType;
  className?: string;
  onClick?: () => void;
}

const TYPE_CONFIGS: Record<
  PreviewType,
  { aspectRatio: string; showTags: boolean; showUrl: boolean; icon: LucideIcon; label: string }
> = {
  project: { aspectRatio: "aspect-video", showTags: true, showUrl: true, icon: FolderGit2, label: "Projeto" },
  certificate: { aspectRatio: "aspect-[4/3]", showTags: false, showUrl: false, icon: Award, label: "Certificado" },
  testimonial: { aspectRatio: "aspect-square", showTags: false, showUrl: false, icon: Quote, label: "Depoimento" },
  service: { aspectRatio: "aspect-video", showTags: true, showUrl: true, icon: Briefcase, label: "Serviço" },
  generic: { aspectRatio: "aspect-video", showTags: true, showUrl: false, icon: Layers, label: "Item" },
};

export function PreviewCard({ data, type = "generic", className = "", onClick }: PreviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const config = TYPE_CONFIGS[type];

  const hasImage = !!data.image && !imageError;
  const PlaceholderIcon = config.icon;

  const StatusIcon = data.published ? Eye : EyeOff;
  const statusColor = data.published ? "text-green-600" : "text-orange-600";
  const statusBg = data.published ? "bg-green-600/10" : "bg-orange-600/10";

  const interactive = !!onClick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`group relative overflow-hidden rounded-2xl border border-foreground/10 bg-surface transition-all hover:border-foreground/20 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 ${
        interactive ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Status Badge */}
      <div className="absolute right-3 top-3 z-10">
        <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${statusBg} ${statusColor}`}>
          <StatusIcon className="h-3 w-3" />
          {data.published ? "Publicado" : "Rascunho"}
        </div>
      </div>

      {/* Image / Placeholder */}
      <div className={`relative w-full overflow-hidden bg-surface/50 ${config.aspectRatio}`}>
        {hasImage ? (
          <Image
            src={data.image!}
            alt={data.title}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-foreground/[0.07] via-foreground/[0.03] to-transparent">
            <PlaceholderIcon className="h-8 w-8 text-foreground/25" strokeWidth={1.5} />
            <span className="text-xs font-medium text-muted">{config.label}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="font-roobert font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {data.title || "Sem título"}
          </h3>
          {data.subtitle && (
            <p className="text-sm text-muted line-clamp-1">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-sm text-foreground/80 line-clamp-2">
            {data.description}
          </p>
        )}

        {/* Tags */}
        {config.showTags && data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block rounded-lg bg-foreground/10 px-2 py-1 text-xs font-medium text-foreground/70"
              >
                {tag}
              </span>
            ))}
            {data.tags.length > 3 && (
              <span className="inline-block rounded-lg bg-foreground/5 px-2 py-1 text-xs font-medium text-muted">
                +{data.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {/* Date */}
          {data.date && (
            <span className="text-xs text-muted">
              {data.date}
            </span>
          )}

          {/* URL */}
          {config.showUrl && data.url && (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-foreground/10 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/20"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Ver projeto</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function PreviewGrid({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
      {children}
    </div>
  );
}