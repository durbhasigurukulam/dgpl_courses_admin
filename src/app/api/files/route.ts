import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readdir, stat, access, constants } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;
  const description: string | null = data.get('description') as string;
  const isPublic: boolean | null = data.get('isPublic') === 'true';
  const tags: string | null = data.get('tags') as string;

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file found' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${uuidv4()}-${file.name}`;
  const path = join(UPLOAD_DIR, filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`File uploaded to ${path}`);
    
    const stats = await stat(path);
    const fileData = {
      _id: filename,
      filename: filename,
      originalName: file.name,
      publicUrl: `/uploads/${filename}`,
      size: stats.size,
      mimetype: file.type,
      category: 'uncategorized',
      description: description || '',
      isPublic: isPublic || false,
      tags: tags ? tags.split(',') : [],
      createdAt: stats.ctime.toISOString(),
      downloadCount: 0,
    };

    return NextResponse.json({ success: true, data: fileData });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ success: false, message: 'Error saving file' }, { status: 500 });
  }
}

export async function GET() {
  console.log('Request received at /api/files');
  const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
  
  try {
    await access(UPLOAD_DIR, constants.F_OK);
  } catch (e) {
    // If the directory doesn't exist, return an empty array
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const filenames = await readdir(UPLOAD_DIR);
    if (filenames.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }
      
    const files = await Promise.all(
      filenames.map(async (name) => {
        const stats = await stat(join(UPLOAD_DIR, name));
        return {
            _id: name,
            filename: name,
            originalName: name,
            publicUrl: `/uploads/${name}`,
            size: stats.size,
            mimetype: 'application/octet-stream', // Placeholder
            category: 'uncategorized', // Placeholder
            description: '', // Placeholder
            isPublic: true, // Default
            tags: [], // Default
            createdAt: stats.ctime.toISOString(),
            downloadCount: 0, // Default
        };
      })
    );
    return NextResponse.json({ success: true, data: files });
  } catch (error) {
    console.error('Error reading files:', error);
    return NextResponse.json({ success: false, message: 'Error reading files' }, { status: 500 });
  }
}