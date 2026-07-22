// ฟังก์ชันแปลงโพสต์เดี่ยวจาก Strapi ให้หยิบใช้ง่ายในหน้าบ้าน
// 🌟 ส่งค่า strapiUrl เข้ามาผ่าน Parameter ตัวที่สองแทน
export function normalizePost(rawPost: any, strapiUrl: string = 'http://localhost:1337'): any {
  if (!rawPost) return null;

  const id = rawPost.id;
  const attrs = rawPost.attributes ? rawPost.attributes : rawPost;

  // 1. จัดการดึง URL รูปภาพปก
  let imageUrl = 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200'; // fallback image
  const media = attrs.image?.data || attrs.image;
  if (media) {
    const mediaAttrs = media.attributes ? media.attributes : media;
    
    imageUrl = mediaAttrs.url.startsWith('http') 
      ? mediaAttrs.url 
      : `${strapiUrl}${mediaAttrs.url}`;
  }

  // 2. แปลง Rich Text Blocks (JSON) จาก Strapi ให้เป็น HTML
  const htmlContent = renderStrapiBlocks(attrs.content);

  // 3. ฟอร์แมตวันที่ให้อ่านง่ายสไตล์มินิมอล (เช่น 16 มิ.ย. 2026)
  const formattedDate = attrs.publishedAt 
    ? new Date(attrs.publishedAt).toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '';

  return {
    id,
    slug: attrs.slug,
    title: attrs.title,
    description: attrs.description,
    content: htmlContent,
    image: imageUrl,
    date: formattedDate,
    author: attrs.author || 'Yutthana',
    readTime: attrs.readTime ? `${attrs.readTime} นาที` : '5 นาที',
    //  ของใหม่ (ปลอดภัยขึ้น 100%):
tags: attrs.tags && Array.isArray(attrs.tags) 
  ? attrs.tags 
  : (attrs.tags ? [attrs.tags] : []),
    featured: attrs.featured || false
  };
}

// ฟังก์ชันแกะ Blocks แปลงเป็น HTML อย่างง่าย
function renderStrapiBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks.map((block: any) => {
    // ย่อหน้าธรรมดา
    if (block.type === 'paragraph') {
      const textContent = block.children?.map((child: any) => {
        let text = child.text;
        if (child.bold) text = `<strong>${text}</strong>`;
        if (child.italic) text = `<em>${text}</em>`;
        return text;
      }).join('') || '';
      
      if (textContent.trim() === '') return '<br/>';

      if (textContent.startsWith('### ')) {
        return `<h3>${textContent.replace('### ', '')}</h3>`;
      }
      if (textContent.startsWith('- ')) {
        return `<li>${textContent.replace('- ', '')}</li>`;
      }
      return `<p>${textContent}</p>`;
    }

    // หัวข้อหลัก (H1, H2, H3, ...)
    if (block.type === 'heading') {
      const text = block.children?.map((c: any) => c.text).join('') || '';
      const level = block.level || 2;
      return `<h${level}>${text}</h${level}>`;
    }

    // รายการแบบ List
    if (block.type === 'list') {
      const items = block.children?.map((item: any) => {
        const text = item.children?.map((c: any) => c.text).join('') || '';
        return `<li>${text}</li>`;
      }).join('') || '';
      return block.format === 'ordered' ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
    }

    return '';
  }).join('');
}