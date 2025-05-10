let port;
let writer;
const output = document.getElementById('output');
const connectButton = document.getElementById('connectButton');
// Define điều hướng 
const sequence = {
    ArrowUp: "F",
    ArrowRight: "R",
    ArrowDown: "B",
    ArrowLeft: "L",
    stopCar: "S",
}

// Kết nối Bluetooth qua cổng serial
connectButton.addEventListener('click', async () => {
    // try {
    //     port = await navigator.serial.requestPort(); // Chọn cổng Bluetooth (COM)
    //     await port.open({ baudRate: 9600 }); // Baudrate mặc định của Bluetooth
    //     output.value += 'Đã kết nối Bluetooth\n';
    //     // Thiết lập writer để gửi dữ liệu
    //     writer = port.writable.getWriter();
    //     // Đọc dữ liệu nhận được
    //     const decoder = new TextDecoderStream();
    //     const readableStreamClosed = port.readable.pipeTo(decoder.writable);
    //     const reader = decoder.readable.getReader();
    //     // Lắng nghe dữ liệu từ Bluetooth
    //     while (true) {
    //         const { value, done } = await reader.read();
    //         if (done) break;
    //         output.value += `Nhận: ${value}\n`;
    //     }
    // } catch (error) {
    //     output.value += `Lỗi: ${error.message}\n`;
    // }
    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service']
        });
    } catch (error) {
        output.value += `Lỗi: ${error.message}\n`;
    }
    console.log(device.name);
});

// Gửi dữ liệu tới Bluetooth
async function sendData(value) {
    if (!writer) {
        output.value += 'Chưa kết nối thiết bị!\n';
        return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(value + '\r\n');
    await writer.write(data);
    output.value += `Đã gửi: ${data}\n`;
}

function stop() {
    sendData(sequence.stopCar)
}

function send(value) {
    sendData(value)
}

document.addEventListener('keydown', (event) => {
    if (
        event.key === 'ArrowUp' ||
        event.key === 'ArrowRight' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft'
    ) {
        sendData(sequence[event.key])
    }
});

document.addEventListener('keyup', stop);
document.addEventListener('mouseup', stop);
document.addEventListener('touchend', stop);
