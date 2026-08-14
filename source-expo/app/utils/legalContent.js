const decodeHtmlEntities=value=>String(value||'')
  .replace(/&nbsp;/gi,' ')
  .replace(/&amp;/gi,'&')
  .replace(/&quot;/gi,'"')
  .replace(/&#39;|&apos;/gi,"'")
  .replace(/&lt;/gi,'<')
  .replace(/&gt;/gi,'>')
  .replace(/&#(\d+);/g,(_,code)=>String.fromCharCode(Number(code)));

export const htmlToPlainText=html=>{
  if(!html)return'';

  return decodeHtmlEntities(
    String(html)
      .replace(/<\s*br\s*\/?\s*>/gi,'\n')
      .replace(/<\s*\/\s*(p|h1|h2|h3|h4|section|div)\s*>/gi,'\n\n')
      .replace(/<\s*li[^>]*>/gi,'• ')
      .replace(/<\s*\/\s*li\s*>/gi,'\n')
      .replace(/<[^>]+>/g,'')
  )
    .replace(/[ \t]+\n/g,'\n')
    .replace(/\n[ \t]+/g,'\n')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
};

export const getLocalizedLegalTitle=(document,language)=>{
  if(!document)return'';
  return language==='en'
    ?document.titleEn||document.title||''
    :document.title||document.titleEn||'';
};

export const getLocalizedLegalContent=(document,language)=>{
  if(!document)return'';
  const html=language==='en'
    ?document.contentEn||document.content||''
    :document.content||document.contentEn||'';
  return htmlToPlainText(html);
};
