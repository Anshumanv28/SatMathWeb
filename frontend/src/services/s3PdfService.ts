// S3-compatible PDF service for Supabase Storage
// This service uses direct HTTP requests to the S3-compatible endpoint

export interface S3PDFFile {
  name: string;
  size: number;
  lastModified: string;
  url: string;
}

export interface S3TopicResponse {
  pdfs: S3PDFFile[];
  totalCount: number;
}

class S3PDFService {
  private readonly BUCKET_NAME = "sattopicwisedata";
  private readonly S3_ENDPOINT = "https://glppwlmcgyrwzqwukryw.storage.supabase.co";
  private readonly SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdscHB3bG1jZ3lyd3pxd3Vrcnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTE3NjAsImV4cCI6MjA2ODY4Nzc2MH0.30lgB48oqd7QaITJZjKHXCmBUnpGv0e6PHdbCbOBq5Q";

  /**
   * Get all PDFs from S3-compatible storage for a specific topic
   */
  async getPDFsByTopic(topic: string): Promise<S3PDFFile[]> {
    try {
      console.log(`Fetching PDFs for topic: ${topic} from S3 bucket: ${this.BUCKET_NAME}`);
      
      // Use the S3-compatible endpoint to list objects
      const url = `${this.S3_ENDPOINT}/storage/v1/object/list/${this.BUCKET_NAME}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'apikey': this.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          prefix: `${topic}/`,
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        })
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`No files found for topic: ${topic}`);
          return [];
        }
        throw new Error(`S3 API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        console.log(`No files found for topic: ${topic}`);
        return [];
      }

      // Filter for PDF files and format the response
      const pdfFiles: S3PDFFile[] = data
        .filter((file: any) => file.name.toLowerCase().endsWith('.pdf'))
        .map((file: any) => ({
          name: file.name.split('/').pop() || file.name, // Get just the filename
          size: file.metadata?.size || 0,
          lastModified: file.created_at || file.updated_at || new Date().toISOString(),
          url: this.getPublicUrl(`${topic}/${file.name}`)
        }));

      console.log(`Found ${pdfFiles.length} PDF files for topic: ${topic}`);
      return pdfFiles;

    } catch (error) {
      console.error("Error fetching PDFs from S3:", error);
      return [];
    }
  }

  /**
   * Get all topics with PDFs from S3 storage
   */
  async getTopicsWithPDFs(): Promise<string[]> {
    try {
      console.log('Fetching topics from S3 bucket...');
      
      const url = `${this.S3_ENDPOINT}/storage/v1/object/list/${this.BUCKET_NAME}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'apikey': this.SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          prefix: '',
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        })
      });

      if (!response.ok) {
        console.error(`S3 API error: ${response.status} ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        return [];
      }

      // Extract unique topic folders
      const topics = new Set<string>();
      data.forEach((file: any) => {
        if (file.name && file.name.includes('/')) {
          const topic = file.name.split('/')[0];
          if (topic && file.name.toLowerCase().endsWith('.pdf')) {
            topics.add(topic);
          }
        }
      });

      console.log(`Found topics: ${Array.from(topics)}`);
      return Array.from(topics);

    } catch (error) {
      console.error("Error fetching topics from S3:", error);
      return [];
    }
  }

  /**
   * Get public URL for a file in S3-compatible storage
   */
  private getPublicUrl(filePath: string): string {
    return `${this.S3_ENDPOINT}/storage/v1/object/public/${this.BUCKET_NAME}/${filePath}`;
  }

  /**
   * Check if a PDF exists in S3 storage
   */
  async checkPDFExists(topic: string, filename: string): Promise<boolean> {
    try {
      const url = this.getPublicUrl(`${topic}/${filename}`);
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error("Error checking PDF existence:", error);
      return false;
    }
  }

  /**
   * Format file size in human readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format date in human readable format
   */
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  }
}

export const s3PdfService = new S3PDFService();
