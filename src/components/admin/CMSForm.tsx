import React from 'react';
import { Programme, ProgrammeVideo, Explainer, ExplainerItem, Briefing } from '../../types';
import { Upload, X, Save } from 'lucide-react';

interface CMSFormProps {
  type: string;
  data: any;
  programmes: Programme[];
  explainers: Explainer[];
  onChange: (updatedData: any) => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
  uploadProgress: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
}

const getYoutubeVideoId = (url: string): string => {
  if (!url) return '';
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  } catch {
    return '';
  }
};

export default function CMSForm({
  type,
  data,
  programmes,
  explainers,
  onChange,
  onSave,
  onCancel,
  uploadProgress,
  onFileChange
}: CMSFormProps) {
  const isEdit = !!(data.id || data.slug);

  const setField = (field: string, val: any) => {
    onChange({ ...data, [field]: val });
  };

  return (
    <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-outline-variant pb-3">
        <div>
          <h2 className="font-headline-md text-primary">{isEdit ? 'Edit' : 'Create New'} {type.replace(/([A-Z])/g, ' $1')}</h2>
          <p className="text-xs text-on-surface-variant font-mono mt-1">
            {data.id ? `Document ID: ${data.id}` : 'Pending Save (Auto ID or Slug)'}
          </p>
        </div>
        <button onClick={onCancel} className="text-on-surface-variant hover:text-primary p-2 cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={onSave} className="space-y-4">
        {/* programmes Form */}
        {type === 'programmes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Title *</label>
              <input type="text" required value={data.title || ''} onChange={(e) => setField('title', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Slug * (Lower-case characters, dashes only)</label>
              <input type="text" required value={data.slug || ''} onChange={(e) => setField('slug', e.target.value)} placeholder="e.g. osita-insights" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Tagline</label>
              <input type="text" value={data.tagline || ''} onChange={(e) => setField('tagline', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Host Name</label>
              <input type="text" value={data.hostName || ''} onChange={(e) => setField('hostName', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Schedule text</label>
              <input type="text" value={data.scheduleText || ''} onChange={(e) => setField('scheduleText', e.target.value)} placeholder="e.g. Twice Monthly, Weekdays" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Format Type</label>
              <select value={data.formatType || 'interview'} onChange={(e) => setField('formatType', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="interview">Interview</option>
                <option value="commentary">Commentary</option>
                <option value="daily-brief">Daily Brief</option>
                <option value="documentary">Documentary</option>
                <option value="panel">Panel</option>
                <option value="analysis">Analysis</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Coverage Area</label>
              <select value={data.coverageArea || 'Nigeria'} onChange={(e) => setField('coverageArea', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="Nigeria">Nigeria</option>
                <option value="Africa">Africa</option>
                <option value="Global">Global</option>
                <option value="Nigeria & Africa">Nigeria & Africa</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Short Description *</label>
              <textarea required value={data.shortDescription || ''} onChange={(e) => setField('shortDescription', e.target.value)} rows={2} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Full Description</label>
              <textarea value={data.fullDescription || ''} onChange={(e) => setField('fullDescription', e.target.value)} rows={4} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Cover Image URL</label>
              <input type="text" value={data.coverImage || ''} onChange={(e) => setField('coverImage', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Thumbnail Image URL</label>
              <input type="text" value={data.thumbnailImage || ''} onChange={(e) => setField('thumbnailImage', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Programme Card Image URL</label>
              <input type="text" value={data.cardImageUrl || ''} onChange={(e) => setField('cardImageUrl', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Programme Cover Image URL</label>
              <input type="text" value={data.coverImageUrl || ''} onChange={(e) => setField('coverImageUrl', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Programme Thumbnail URL</label>
              <input type="text" value={data.thumbnailUrl || ''} onChange={(e) => setField('thumbnailUrl', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">YouTube Playlist URL</label>
              <input type="text" value={data.youtubePlaylistUrl || ''} onChange={(e) => setField('youtubePlaylistUrl', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Sort Order</label>
                <input type="number" value={data.sortOrder || 0} onChange={(e) => setField('sortOrder', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Status</label>
                <select value={data.status || 'active'} onChange={(e) => setField('status', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2 border-t border-outline-variant pt-3 mt-2 grid grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">SEO Title</label>
                <input type="text" value={data.seoTitle || ''} onChange={(e) => setField('seoTitle', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">SEO Description</label>
                <input type="text" value={data.seoDescription || ''} onChange={(e) => setField('seoDescription', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* programmeVideos Form */}
        {type === 'programmeVideos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Programme *</label>
              <select 
                required 
                value={data.programmeId || ''} 
                onChange={(e) => {
                  const pId = e.target.value;
                  const found = programmes.find(p => p.id === pId);
                  onChange({
                    ...data,
                    programmeId: pId,
                    programmeTitle: found ? found.title : ''
                  });
                }} 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
              >
                <option value="">-- Choose Programme --</option>
                {programmes.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Video Title *</label>
              <input 
                type="text" 
                required 
                value={data.title || ''} 
                onChange={(e) => {
                  const val = e.target.value;
                  // If slug is empty, set automatic draft slug
                  const autoSlug = !data.slug ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : data.slug;
                  onChange({
                    ...data,
                    title: val,
                    slug: autoSlug
                  });
                }} 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">URL Reference Slug *</label>
              <input 
                type="text" 
                required 
                value={data.slug || ''} 
                onChange={(e) => setField('slug', e.target.value)} 
                placeholder="e.g. ep-1-power-crisis" 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">YouTube Video Play URL *</label>
              <input 
                type="text" 
                required 
                value={data.youtubeUrl || ''} 
                onChange={(e) => {
                  const url = e.target.value;
                  const vidId = getYoutubeVideoId(url);
                  const updated = {
                    ...data,
                    youtubeUrl: url,
                    youtubeVideoId: vidId || data.youtubeVideoId || '',
                    embedUrl: vidId ? `https://www.youtube.com/embed/${vidId}` : (data.embedUrl || ''),
                    thumbnailUrl: vidId ? `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg` : (data.thumbnailUrl || '')
                  };
                  onChange(updated);
                }} 
                placeholder="e.g. https://www.youtube.com/watch?v=WEA1_bXybRY" 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">YouTube Video ID (Auto or custom)</label>
              <input 
                type="text" 
                value={data.youtubeVideoId || ''} 
                onChange={(e) => {
                  const vidId = e.target.value;
                  onChange({
                    ...data,
                    youtubeVideoId: vidId,
                    embedUrl: vidId ? `https://www.youtube.com/embed/${vidId}` : data.embedUrl,
                    thumbnailUrl: vidId ? `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg` : data.thumbnailUrl
                  });
                }} 
                placeholder="e.g. WEA1_bXybRY" 
                className="w-full px-3 py-2 border border-outline rounded text-sm font-mono bg-transparent" 
              />
            </div>
            <div className="hidden">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Duration</label>
              <input type="text" value={data.duration || ''} onChange={(e) => setField('duration', e.target.value)} placeholder="e.g. 08:30" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Thumbnail URL</label>
              <input type="text" value={data.thumbnailUrl || ''} onChange={(e) => setField('thumbnailUrl', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Embed URL</label>
              <input type="text" value={data.embedUrl || ''} onChange={(e) => setField('embedUrl', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Presenter / Host</label>
              <input 
                type="text" 
                value={data.presenter || data.presenters || ''} 
                onChange={(e) => {
                  onChange({
                    ...data,
                    presenters: e.target.value,
                    presenter: e.target.value
                  });
                }} 
                placeholder="e.g. Annabel K."
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Guest Names</label>
              <input 
                type="text" 
                value={data.guestNames || data.guests || ''} 
                onChange={(e) => {
                  onChange({
                    ...data,
                    guests: e.target.value,
                    guestNames: e.target.value
                  });
                }} 
                placeholder="e.g. John Doe, Osita Chidoka" 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Topic Tags (Comma separated)</label>
              <input 
                type="text" 
                value={Array.isArray(data.topicTags) ? data.topicTags.join(', ') : (data.topicTags || '')} 
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(tag => tag.trim().toUpperCase()).filter(Boolean);
                  setField('topicTags', arr);
                }} 
                placeholder="e.g. GOVERNANCE, INFRASTRUCTURE, POWER" 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Short Summary</label>
              <textarea value={data.shortSummary || ''} onChange={(e) => setField('shortSummary', e.target.value)} rows={2} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Full Description / Takeaway</label>
              <textarea value={data.fullDescription || ''} onChange={(e) => setField('fullDescription', e.target.value)} rows={3} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Key Points (One per line)</label>
              <textarea value={data.keyPoints || ''} onChange={(e) => setField('keyPoints', e.target.value)} rows={3} placeholder="- Key point 1&#10;- Key point 2" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Source / Reference Links (One per line)</label>
              <textarea value={data.sourceLinks || ''} onChange={(e) => setField('sourceLinks', e.target.value)} rows={2} placeholder="https://example.com/source" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Status</label>
              <select value={data.status || 'published'} onChange={(e) => setField('status', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Is Featured Video?</label>
              <select value={data.isFeatured ? 'true' : 'false'} onChange={(e) => onChange({ ...data, isFeatured: e.target.value === 'true' })} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="false">No</option>
                <option value="true">Yes, Flag as Featured</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Ordering weight / Sort Order</label>
              <input type="number" value={data.sortOrder || 0} onChange={(e) => setField('sortOrder', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Sorting Date (publishedAt) *</label>
              <input type="date" required value={data.publishedAt || ''} onChange={(e) => setField('publishedAt', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Manual Display Date (displayDate)</label>
              <input type="text" value={data.displayDate || ''} onChange={(e) => setField('displayDate', e.target.value)} placeholder="e.g. Oct 24, 2023" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2 border-t border-outline-variant pt-3 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">SEO Title</label>
                <input type="text" value={data.seoTitle || ''} onChange={(e) => setField('seoTitle', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">SEO Description</label>
                <input type="text" value={data.seoDescription || ''} onChange={(e) => setField('seoDescription', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* explainers Form */}
        {type === 'explainers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Explainer Title *</label>
              <input type="text" required value={data.title || ''} onChange={(e) => setField('title', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Slug *</label>
              <input type="text" required value={data.slug || ''} onChange={(e) => setField('slug', e.target.value)} placeholder="e.g. explaining-nigeria" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Tagline</label>
              <input type="text" value={data.tagline || ''} onChange={(e) => setField('tagline', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Short Description *</label>
              <textarea required value={data.shortDescription || ''} onChange={(e) => setField('shortDescription', e.target.value)} rows={2} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Full Description</label>
              <textarea value={data.fullDescription || ''} onChange={(e) => setField('fullDescription', e.target.value)} rows={4} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Coverage Area</label>
              <select value={data.coverageArea || 'Nigeria'} onChange={(e) => setField('coverageArea', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="Nigeria">Nigeria</option>
                <option value="Africa">Africa</option>
                <option value="Global">Global</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Sort Order</label>
              <input type="number" value={data.sortOrder || 0} onChange={(e) => setField('sortOrder', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Status</label>
              <select value={data.status || 'active'} onChange={(e) => setField('status', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Cover Image</label>
              <input type="text" value={data.coverImage || ''} onChange={(e) => setField('coverImage', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
          </div>
        )}

        {/* explainerItems Form */}
        {type === 'explainerItems' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Explainer Category *</label>
              <select required value={data.explainerId || ''} onChange={(e) => setField('explainerId', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="">-- Choose Explainer Label --</option>
                {explainers.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Item Title *</label>
              <input type="text" required value={data.title || ''} onChange={(e) => setField('title', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Slug *</label>
              <input type="text" required value={data.slug || ''} onChange={(e) => setField('slug', e.target.value)} placeholder="e.g. federalism-architecture" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Explainer Format Type</label>
              <select value={data.explainerType || 'text'} onChange={(e) => setField('explainerType', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="text">Text / Written Article</option>
                <option value="video">Video Explainer</option>
                <option value="text-and-video">Text and Video</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">YouTube URL (if holds video clip)</label>
              <input type="text" value={data.youtubeUrl || ''} onChange={(e) => setField('youtubeUrl', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Thumbnail/Featured Image URL</label>
              <input type="text" value={data.featuredImage || ''} onChange={(e) => setField('featuredImage', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Teaser Excerpt *</label>
              <textarea required value={data.excerpt || ''} onChange={(e) => setField('excerpt', e.target.value)} rows={2} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Article Body Content (Markdown supported) *</label>
              <textarea required value={data.content || ''} onChange={(e) => setField('content', e.target.value)} rows={6} className="w-full px-3.5 py-2 border border-outline rounded text-sm font-mono bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Key Questions Answered (One per line)</label>
              <textarea value={data.keyQuestions || ''} onChange={(e) => setField('keyQuestions', e.target.value)} rows={2} placeholder="What limits local government revenue?&#10;How does the Supreme Court rule on this?" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Key Takeaways (One per line)</label>
              <textarea value={data.keyPoints || ''} onChange={(e) => setField('keyPoints', e.target.value)} rows={2} placeholder="- States cannot withhold federal allocations.&#10;- Joint accounts are audited." className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Status</label>
              <select value={data.status || 'published'} onChange={(e) => setField('status', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Published At Date</label>
              <input type="date" value={data.publishedAt || ''} onChange={(e) => setField('publishedAt', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
          </div>
        )}

        {/* briefings Form */}
        {type === 'briefings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Briefing Title *</label>
              <input type="text" required value={data.title || ''} onChange={(e) => setField('title', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Slug *</label>
              <input type="text" required value={data.slug || ''} onChange={(e) => setField('slug', e.target.value)} placeholder="e.g. sahel-resource-diplomacy" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Briefing Type</label>
              <select value={data.briefingType || 'daily'} onChange={(e) => setField('briefingType', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="daily">Daily Briefing</option>
                <option value="weekly">Weekly Summary</option>
                <option value="special">Special Bulletin</option>
                <option value="analysis">Deep Analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">YouTube Video URL</label>
              <input type="text" value={data.youtubeUrl || ''} onChange={(e) => setField('youtubeUrl', e.target.value)} placeholder="e.g. https://www.youtube.com/watch?v=3H95x0BV9nA" className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Presenter/Host</label>
              <input type="text" value={data.presenter || 'Annabel K.'} onChange={(e) => setField('presenter', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Excerpt Summary *</label>
              <textarea required value={data.excerpt || ''} onChange={(e) => setField('excerpt', e.target.value)} rows={2} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Core Narrative content (Markdown supported)</label>
              <textarea value={data.content || ''} onChange={(e) => setField('content', e.target.value)} rows={5} className="w-full px-3 py-2 border border-outline rounded text-sm font-mono bg-transparent" />
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-outline-variant pt-3 mt-1">
              <div>
                <label className="block text-[11px] uppercase font-bold text-primary mb-1">What Happened</label>
                <textarea value={data.whatHappened || ''} onChange={(e) => setField('whatHappened', e.target.value)} rows={3} placeholder="The key announcements..." className="w-full px-2 py-1.5 border border-outline rounded text-xs bg-transparent" />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-primary mb-1">Why It Matters</label>
                <textarea value={data.whyItMatters || ''} onChange={(e) => setField('whyItMatters', e.target.value)} rows={3} placeholder="The systemic effects..." className="w-full px-2 py-1.5 border border-outline rounded text-xs bg-transparent" />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-primary mb-1">What to Watch Next</label>
                <textarea value={data.whatToWatchNext || ''} onChange={(e) => setField('whatToWatchNext', e.target.value)} rows={3} placeholder="Important upcoming dates..." className="w-full px-2 py-1.5 border border-outline rounded text-xs bg-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Status</label>
              <select value={data.status || 'published'} onChange={(e) => setField('status', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Published At Date</label>
              <input type="date" value={data.publishedAt || ''} onChange={(e) => setField('publishedAt', e.target.value)} className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" />
            </div>
          </div>
        )}

        {/* users Form */}
        {type === 'users' && (
          <div className="grid grid-cols-1 gap-4 font-sans max-w-xl">
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Administrator Full Name *</label>
              <input 
                type="text" 
                required 
                value={data.name || data.displayName || ''} 
                onChange={(e) => onChange({ ...data, name: e.target.value, displayName: e.target.value })} 
                placeholder="e.g. Annabel K." 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" 
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Registry Email Address *</label>
              <input 
                type="email" 
                required 
                value={data.email || ''} 
                onChange={(e) => setField('email', e.target.value.toLowerCase())} 
                placeholder="operator@clearpath.media" 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent" 
              />
            </div>
            {!data.id && (
              <div>
                <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">
                  Operator Password *
                </label>
                <input 
                  type="password" 
                  required 
                  minLength={6}
                  value={data.password || ''} 
                  onChange={(e) => setField('password', e.target.value)} 
                  placeholder="Min 6 characters required" 
                  className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent font-mono" 
                />
              </div>
            )}
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Access Role Privilege</label>
              <select 
                value={data.role || 'viewer_admin'} 
                onChange={(e) => {
                  const r = e.target.value;
                  onChange({
                    ...data,
                    role: r,
                    isSuperAdmin: r === 'super_admin'
                  });
                }} 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
              >
                <option value="super_admin">Super Admin (Full Access + User Management)</option>
                <option value="admin">Admin (Settings & Content)</option>
                <option value="content_admin">Content Admin (Content management only)</option>
                <option value="viewer_admin">Viewer Admin (Read-only browsing)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Account Active Status</label>
              <select 
                value={data.status || 'active'} 
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({
                    ...data,
                    status: val,
                    disabled: val === 'disabled'
                  });
                }} 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
              >
                <option value="active">active (Access Allowed)</option>
                <option value="disabled">disabled (Lockout/Blocked)</option>
              </select>
            </div>
            
            <div className="flex items-center gap-3 py-2 border-t border-outline-variant mt-2">
              <input 
                type="checkbox" 
                id="canPublishContent"
                checked={data.role === 'super_admin' || data.role === 'admin' || !!data.canPublishContent} 
                disabled={data.role === 'super_admin' || data.role === 'admin' || data.role === 'viewer_admin'}
                onChange={(e) => setField('canPublishContent', e.target.checked)}
                className="w-4 h-4 text-primary bg-transparent border-outline rounded cursor-pointer disabled:opacity-50"
              />
              <label htmlFor="canPublishContent" className="text-xs uppercase font-bold text-on-surface-variant cursor-pointer select-none">
                Allow content publishing (For Content Admins)
              </label>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Operator Notes</label>
              <textarea 
                value={data.notes || ''} 
                onChange={(e) => setField('notes', e.target.value)} 
                rows={3} 
                placeholder="Optional notes or context about this operator account..." 
                className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
              />
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end border-t border-outline-variant pt-4 mt-4">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-outline hover:bg-surface-container-high rounded text-sm font-semibold cursor-pointer">
            Cancel
          </button>
          <button type="submit" className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer">
            <Save className="w-4 h-4" /> Save Record
          </button>
        </div>
      </form>
    </div>
  );
}
