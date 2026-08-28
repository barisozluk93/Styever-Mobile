import api from './axiosClient';

export const getLegalContentBySlug=async(slug)=>{
  const response=await api.get(
    `LegalContent/GetBySlug/${encodeURIComponent(slug)}`,
  );

  return response.data;
};

export const getRegistrationLegalContents=async()=>{
  const slugs=['terms-of-use','privacy-policy','kvkk'];
  const responses=await Promise.all(
    slugs.map(slug=>getLegalContentBySlug(slug)),
  );

  return slugs.reduce((result,slug,index)=>{
    const response=responses[index];
    if(response?.isSuccess&&response?.data){
      result[slug]=response.data;
    }
    return result;
  },{});
};


export const getPurchaseLegalContents=async()=>{
  const response=await getLegalContentBySlug(
    'distance-sales-agreement',
  );

  if(!response?.isSuccess||!response?.data){
    throw new Error(
      response?.message||
      'Purchase legal content could not be loaded.',
    );
  }

  return response.data;
};
