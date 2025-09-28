import { supabase } from "../lib/supabase";

export interface PDFFile {
  name: string;
  url: string;
  size: number;
  lastModified: string;
  topic: string;
}

export interface TopicPDFs {
  topic: string;
  pdfs: PDFFile[];
  totalCount: number;
}

class PDFService {
  private readonly BUCKET_NAME = "sattopicwisedata"; // Update this to match your bucket name
  
  // Check if bucket exists
  private async checkBucketExists(): Promise<boolean> {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error('Error checking buckets:', error);
        return false;
      }
      return buckets.some(bucket => bucket.name === this.BUCKET_NAME);
    } catch (error) {
      console.error('Error in checkBucketExists:', error);
      return false;
    }
  }

  /**
   * Get all PDFs from Supabase storage for a specific topic
   */
  async getPDFsByTopic(topic: string): Promise<PDFFile[]> {
    try {
      console.log(`Fetching PDFs for topic: ${topic} from bucket: ${this.BUCKET_NAME}`);
      
      // Check if bucket exists first
      const bucketExists = await this.checkBucketExists();
      if (!bucketExists) {
        console.warn(`Bucket "${this.BUCKET_NAME}" does not exist. Please create it in your Supabase dashboard.`);
        return [];
      }
      
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(topic, {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Error fetching PDFs for topic:", topic, error);
        return [];
      }

      console.log(`Found ${data?.length || 0} files in topic ${topic}:`, data);

      // Filter only PDF files
      const pdfFiles = data.filter((file) =>
        file.name.toLowerCase().endsWith(".pdf")
      );

      // Get public URLs for each PDF
      const pdfsWithUrls = await Promise.all(
        pdfFiles.map(async (file) => {
          const { data: urlData } = supabase.storage
            .from(this.BUCKET_NAME)
            .getPublicUrl(`${topic}/${file.name}`);

          return {
            name: file.name,
            url: urlData.publicUrl,
            size: file.metadata?.size || 0,
            lastModified: file.updated_at || file.created_at,
            topic: topic,
          };
        })
      );

      return pdfsWithUrls;
    } catch (error) {
      console.error("Error in getPDFsByTopic:", error);
      return [];
    }
  }

  /**
   * Get all available topics that have PDFs
   */
  async getTopicsWithPDFs(): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list("", {
          limit: 100,
          offset: 0,
        });

      if (error) {
        console.error("Error fetching topics:", error);
        return [];
      }

      // Get all folders (topics) that contain PDFs
      const topicsWithPDFs = await Promise.all(
        data.map(async (folder) => {
          if (folder.metadata?.mimetype === "application/folder") {
            const pdfs = await this.getPDFsByTopic(folder.name);
            return pdfs.length > 0 ? folder.name : null;
          }
          return null;
        })
      );

      return topicsWithPDFs.filter(Boolean) as string[];
    } catch (error) {
      console.error("Error in getTopicsWithPDFs:", error);
      return [];
    }
  }

  /**
   * Get all PDFs organized by topic
   */
  async getAllPDFsByTopic(): Promise<TopicPDFs[]> {
    try {
      const topics = await this.getTopicsWithPDFs();

      const topicsWithPDFs = await Promise.all(
        topics.map(async (topic) => {
          const pdfs = await this.getPDFsByTopic(topic);
          return {
            topic,
            pdfs,
            totalCount: pdfs.length,
          };
        })
      );

      return topicsWithPDFs.filter((topicData) => topicData.totalCount > 0);
    } catch (error) {
      console.error("Error in getAllPDFsByTopic:", error);
      return [];
    }
  }

  /**
   * Get a specific PDF by topic and filename
   */
  async getPDF(topic: string, filename: string): Promise<string | null> {
    try {
      const { data } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(`${topic}/${filename}`);

      return data.publicUrl;
    } catch (error) {
      console.error("Error getting PDF:", error);
      return null;
    }
  }

  /**
   * Check if a PDF exists in storage
   */
  async checkPDFExists(topic: string, filename: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(topic, {
          search: filename,
        });

      if (error) {
        console.error("Error checking PDF existence:", error);
        return false;
      }

      return data.some((file) => file.name === filename);
    } catch (error) {
      console.error("Error in checkPDFExists:", error);
      return false;
    }
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

export const pdfService = new PDFService();
