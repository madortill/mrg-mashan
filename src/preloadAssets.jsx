const imageModules = import.meta.glob(
    "/src/assets/**/*.{png,jpg,jpeg,webp,svg,gif,avif}",
    {
      eager: true,
      import: "default",
    }
  );
  
  const imageUrls = Object.values(imageModules);
  
  export function preloadAssets() {
    const promises = imageUrls.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
  
        img.onload = resolve;
  
        // גם אם בטעות יש asset בעייתי,
        // לא נתקע לנצח במסך הטעינה
        img.onerror = resolve;
  
        img.src = src;
      });
    });
  
    return Promise.all(promises);
  }