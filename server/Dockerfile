FROM node:18

# ตั้งค่าหมายเลขทำงานภายใน container
WORKDIR /usr/src/app

# คัดลอก package.json และ package-lock.json (ถ้ามี) ไปยัง container
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# เปิดพอร์ตที่ container จะฟัง
EXPOSE 3000

# เรียกใช้งานแอปพลิเคชันเมื่อ container เริ่มทำงาน
CMD ["node", "app.js"]
