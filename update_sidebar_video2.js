import fs from 'fs';

let content = fs.readFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', 'utf8');

const target = `          // Extract non-trivial words (length > 3)
          const words = searchTerms.split(/\\W+/).filter(w => w.length > 3);

          // Find best matching video dynamically
          const matched = publishedVideos.find(v => {
            const vTitle = (v.title || '').toLowerCase();
            const vSummary = (v.shortSummary || v.fullDescription || '').toLowerCase();
            const vProg = (v.programmeTitle || v.programmeId || '').toLowerCase();
            const tags = (v.topicTags || []).map(t => t.toLowerCase());
            const keyPts = typeof v.keyPoints === 'string' ? v.keyPoints.toLowerCase() : '';
            const combined = \`\${vTitle} \${vSummary} \${vProg} \${tags.join(' ')} \${keyPts}\`;

            return words.some(word => combined.includes(word));
          }) || publishedVideos[0];
          setVideo(matched);`;

const replacement = `          // Stop words to exclude
          const stopWords = ['this', 'that', 'with', 'from', 'what', 'when', 'where', 'will', 'would', 'could', 'should', 'have', 'been', 'their', 'there', 'your', 'which', 'about'];

          // Extract non-trivial words
          const words = searchTerms.split(/\\W+/).filter(w => w.length > 3 && !stopWords.includes(w));

          // Score videos based on keyword matches
          const scoredVideos = publishedVideos.map(v => {
            const vTitle = (v.title || '').toLowerCase();
            const vSummary = (v.shortSummary || v.fullDescription || '').toLowerCase();
            const vProg = (v.programmeTitle || v.programmeId || '').toLowerCase();
            const tags = (v.topicTags || []).map(t => (t || '').toLowerCase());
            const keyPts = typeof v.keyPoints === 'string' ? v.keyPoints.toLowerCase() : '';
            const combined = \`\${vTitle} \${vSummary} \${vProg} \${tags.join(' ')} \${keyPts}\`;

            let score = 0;
            words.forEach(word => {
              if (vTitle.includes(word)) score += 3; // Title matches weight higher
              else if (combined.includes(word)) score += 1;
            });
            return { video: v, score };
          });

          // Sort by highest score
          scoredVideos.sort((a, b) => b.score - a.score);

          // Get the highest scoring video, or fallback to the latest video if no matches
          const matched = (scoredVideos.length > 0 && scoredVideos[0].score > 0) ? scoredVideos[0].video : publishedVideos[0];
          setVideo(matched);`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', content);
console.log("Fixed sidebar video logic.");
