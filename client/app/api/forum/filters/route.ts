import { NextResponse } from 'next/server';
import getSupabase from '@/lib/supabaseClient';

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase client not available' },
        { status: 500 }
      );
    }

    // Get all unique categories and tags from existing posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('categories, tags');

    if (error) {
      console.error('Error fetching posts for filters:', error);
      return NextResponse.json(
        { error: 'Failed to fetch filter options' },
        { status: 500 }
      );
    }

    // Extract unique categories and tags
    const allCategories = new Set<string>();
    const allTags = new Set<string>();

    posts?.forEach((post) => {
      if (post.categories) {
        post.categories.forEach((cat: string) => allCategories.add(cat));
      }
      if (post.tags) {
        post.tags.forEach((tag: string) => allTags.add(tag));
      }
    });

    return NextResponse.json({
      categories: Array.from(allCategories).sort(),
      tags: Array.from(allTags).sort(),
    });
  } catch (error) {
    console.error('Error in filters API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}