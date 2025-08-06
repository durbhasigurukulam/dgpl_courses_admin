
import { NextRequest, NextResponse } from 'next/server';
import { unlink, writeFile } from 'fs/promises';
import { join } from 'path';

export async function PUT(req: NextRequest, { params }: { params: { fileId: string } }) {
  const { fileId } = params;
  const data = await req.json();
  
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  const path = join(uploadDir, fileId);

  try {
    // In a real app, you'd update the metadata in a database.
    // For this example, we'll just log the data.
    console.log(`Updating metadata for ${fileId}:`, data);
    
    const updatedFileData = {
      id: fileId,
      originalName: fileId,
      ...data,
      publicUrl: `/uploads/${fileId}`,
      downloadUrl: `/uploads/${fileId}`,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: updatedFileData });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json({ success: false, message: 'Error updating file' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { fileId: string } }) {
  const { fileId } = params;
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  const path = join(uploadDir, fileId);

  try {
    await unlink(path);
    console.log(`File deleted: ${path}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ success: false, message: 'Error deleting file' }, { status: 500 });
  }
}
