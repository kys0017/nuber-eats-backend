export interface MailModuleOptions {
  apiKey: string;
  domain: string;
  fromEmail: string;
  myEmail: string; // mailgun 무료 버전이라 내 이메일 숨김 용도.
}
