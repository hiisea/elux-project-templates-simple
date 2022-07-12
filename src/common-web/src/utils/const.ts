export const HomeUrl: string = '/*# =admin?/admin/article/list:/article/list #*/';
export const LoginUrl = (from?: string): string => `/stage/login/*# =admin??__c=dialog&:? #*/from=${encodeURIComponent(from || '')}`;
