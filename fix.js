const fs = require('fs');
let code = fs.readFileSync('src/app/(dashboard)/dashboard/page.tsx', 'utf8');
code = code.replace("import Link from 'next/link'", "import Link from 'next/link';\nimport { DynamicGreeting } from '@/components/DynamicGreeting';");
code = code.replace(/<h1 className="text-2xl.*?<\/h1>/s, '<DynamicGreeting name={firstName} />');
fs.writeFileSync('src/app/(dashboard)/dashboard/page.tsx', code);
