// backfill_author_names.js
// Usage:
// SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=service_role_key node backfill_author_names.js

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  try {
    console.log('Fetching posts without author_name...');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, author_id, author_email, author_name')
      .is('author_name', null);

    if (postsError) throw postsError;

    console.log(`Found ${posts.length} posts to backfill.`);

    for (const post of posts) {
      const userId = post.author_id;
      let derivedName = null;

      if (userId) {
        const { data: users, error: userErr } = await supabase
          .from('users')
          .select('id, raw_user_meta_data')
          .eq('id', userId)
          .limit(1);

        if (userErr) {
          console.warn('Could not fetch user for', userId, userErr.message || userErr);
        } else if (users && users.length) {
          const raw = users[0].raw_user_meta_data || {};
          derivedName = raw.name || null;
        }
      }

      if (!derivedName && post.author_email) {
        derivedName = post.author_email.split('@')[0];
      }

      if (derivedName) {
        const { error: updateErr } = await supabase
          .from('posts')
          .update({ author_name: derivedName })
          .eq('id', post.id);

        if (updateErr) console.warn('Failed to update post', post.id, updateErr.message || updateErr);
        else console.log('Updated post', post.id, '->', derivedName);
      } else {
        console.log('No name found for post', post.id);
      }
    }

    // Backfill comments as well
    console.log('Fetching comments without author_name...');
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select('id, author_id, author_email, author_name')
      .is('author_name', null);

    if (commentsError) throw commentsError;

    console.log(`Found ${comments.length} comments to backfill.`);

    for (const comment of comments) {
      const userId = comment.author_id;
      let derivedName = null;

      if (userId) {
        const { data: users, error: userErr } = await supabase
          .from('users')
          .select('id, raw_user_meta_data')
          .eq('id', userId)
          .limit(1);

        if (userErr) {
          console.warn('Could not fetch user for', userId, userErr.message || userErr);
        } else if (users && users.length) {
          const raw = users[0].raw_user_meta_data || {};
          derivedName = raw.name || null;
        }
      }

      if (!derivedName && comment.author_email) {
        derivedName = comment.author_email.split('@')[0];
      }

      if (derivedName) {
        const { error: updateErr } = await supabase
          .from('comments')
          .update({ author_name: derivedName })
          .eq('id', comment.id);

        if (updateErr) console.warn('Failed to update comment', comment.id, updateErr.message || updateErr);
        else console.log('Updated comment', comment.id, '->', derivedName);
      } else {
        console.log('No name found for comment', comment.id);
      }
    }

    console.log('Backfill complete.');
  } catch (e) {
    console.error('Fatal error:', e.message || e);
    process.exit(1);
  }
}

main();
