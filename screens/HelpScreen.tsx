
import React, { useEffect, useRef } from 'react';

interface Props {
  onClose: () => void;
  initialSection?: string;
}

const HelpScreen: React.FC<Props> = ({ onClose, initialSection }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSection && scrollRef.current) {
      const element = document.getElementById(`help-${initialSection}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialSection]);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-2xl font-bold text-indigo-800">راهنمای بازی دور</h2>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 leading-relaxed text-slate-700 text-right">
        <section id="help-rules">
          <h3 className="text-xl font-bold text-indigo-600 mb-3 border-r-4 border-indigo-600 pr-3">قوانین کلی</h3>
          <p>«دور» یک بازی گروهی حضوری است که روی یک موبایل انجام می‌شود. بازیکنان به صورت دایره می‌نشینند و گوشی را ساعتگرد بین خود جابه‌جا می‌کنند.</p>
          <ul className="list-disc list-inside mt-4 space-y-2 pr-4">
            <li>بازیکنان تیم‌های ۲ نفره تشکیل می‌دهند.</li>
            <li>یارها همیشه روبروی هم می‌نشینند.</li>
            <li>هدف بازی باقی ماندن به عنوان آخرین تیم است.</li>
          </ul>
        </section>

        <section id="help-setup">
          <h3 className="text-xl font-bold text-indigo-600 mb-3 border-r-4 border-indigo-600 pr-3">تنظیمات</h3>
          <p>در ابتدا باید تعداد بازیکنان (۴، ۶ یا ۸ نفر)، تعداد دورها و زمان هر دور را انتخاب کنید. همچنین می‌توانید دسته‌بندی کلمات را محدود کنید.</p>
        </section>

        <section id="help-gameplay">
          <h3 className="text-xl font-bold text-indigo-600 mb-3 border-r-4 border-indigo-600 pr-3">نحوه بازی</h3>
          <p>وقتی نوبت شماست، گوشی را در دست بگیرید و دکمه شروع را بزنید:</p>
          <ul className="list-decimal list-inside mt-4 space-y-3 pr-4">
            <li>کلمه‌ای به شما نمایش داده می‌شود.</li>
            <li>باید کلمه را برای یارتان (که روبروی شما نشسته) توضیح دهید.</li>
            <li><b>ممنوع:</b> گفتن خود کلمه، بخشی از آن، ریشه کلمه یا ترجمه آن به زبان دیگر.</li>
            <li>وقتی یارتان کلمه را درست حدس زد، روی کلمه بزنید و گوشی را سریع به نفر سمت راست بدهید.</li>
          </ul>
        </section>

        <section id="help-timers">
          <h3 className="text-xl font-bold text-indigo-600 mb-3 border-r-4 border-indigo-600 pr-3">سیستم زمان</h3>
          <p>هر تیم یک زمان کل دارد که فقط در نوبت اعضای آن تیم کم می‌شود. اگر زمان تیم به صفر برسد، آن تیم بلافاصله حذف می‌شود.</p>
          <p className="mt-2">تایمر دور نیز در بالای صفحه نمایش داده می‌شود. با اتمام زمان دور، بازی موقتاً متوقف شده و دور بعدی شروع می‌شود.</p>
        </section>

        <section id="help-swap">
          <h3 className="text-xl font-bold text-indigo-600 mb-3 border-r-4 border-indigo-600 pr-3">تعویض کلمه</h3>
          <p>اگر کلمه‌ای خیلی سخت بود، بعد از ۲۰ ثانیه دکمه «تعویض کلمه» فعال می‌شود که می‌توانید با زدن آن، کلمه جدیدی بگیرید.</p>
        </section>
      </div>

      <div className="p-6 bg-indigo-50 border-t">
        <button onClick={onClose} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold">فهمیدم!</button>
      </div>
    </div>
  );
};

export default HelpScreen;
