import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/content.config.ts', 'utf8');
c = c.replace(
  'icon: z.string().optional(),\n        slug: z.string().optional(),\n      })',
  'icon: z.string().optional(),\n      })'
);
// Check if slug already exists
if (c.includes('slug: z.string().optional()')) {
  console.log('slug already exists');
} else {
  c = c.replace(
    'icon: z.string().optional(),\n      })',
    'icon: z.string().optional(),\n        slug: z.string().optional(),\n      })'
  );
  writeFileSync('src/content.config.ts', c);
  console.log('added slug');
}
