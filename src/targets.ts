import {CoreState, CortexM, CortexReg, CortexSpecialReg, Device} from "dapjs";

/**
 * Specifies all of the parameters associated with a flashing algorithm for a particular device. These
 * can be found in the pyOCD or DAPLink sources, or compiled from the source that can be found here:
 * https://github.com/mbedmicro/FlashAlgo.
 *
 * TODO: add JavaScript as a third target for FlashAlgo's output.
 */
interface IFlashAlgo {
    load_address: number;
    pcInit: number;
    pcEraseAll: number;
    pcEraseSector: number;
    pcProgramPage: number;
    beginStack: number;
    beginData: number;
    pageBuffers: number[];
    staticBase: number;
    minProgramLength: number;
    code: number[];
}

/**
 * Flashing parameters for the NXP K64F. Found here:
 * https://github.com/mbedmicro/pyOCD/blob/master/pyOCD/target/target_MK64FN1M0xxx12.py
 */
const K64FFlashAlgo = {
    beginData : 0x20003000,
    beginStack : 0x20001000,
    code: [
        0xE00ABE00, 0x062D780D, 0x24084068, 0xD3000040, 0x1E644058, 0x1C49D1FA, 0x2A001E52, 0x4770D1F2,
        0x4604b570, 0x4616460d, 0x5020f24c, 0x81c84932, 0x1028f64d, 0x460881c8, 0xf0208800, 0x80080001,
        0x4448482e, 0xf8dcf000, 0x2001b108, 0x2000bd70, 0x4601e7fc, 0x47702000, 0x4929b510, 0x44484827,
        0xf8b8f000, 0xb92c4604, 0x48242100, 0xf0004448, 0x4604f9a9, 0xf837f000, 0xbd104620, 0x4604b570,
        0x4448481e, 0x46214b1e, 0xf00068c2, 0x4605f85d, 0x481ab93d, 0x23004448, 0x68c24621, 0xf946f000,
        0xf0004605, 0x4628f820, 0xb5febd70, 0x460c4605, 0x46234616, 0x46294632, 0x44484810, 0xf8f8f000,
        0xb9674607, 0x22012000, 0x2000e9cd, 0x46224633, 0x90024629, 0x44484809, 0xf984f000, 0xf0004607,
        0x4638f802, 0x4807bdfe, 0xf4206840, 0xf5000070, 0x49040070, 0x47706048, 0x40052000, 0x00000004,
        0x6b65666b, 0x4001f000, 0x4a0e2070, 0x20807010, 0xbf007010, 0x7800480b, 0x280009c0, 0x4809d0fa,
        0xf0017801, 0xb1080020, 0x47702067, 0x0010f001, 0x2068b108, 0xf001e7f9, 0xb1080001, 0xe7f42069,
        0xe7f22000, 0x40020000, 0x4df0e92d, 0x460d4604, 0x469a4690, 0xf0004650, 0x4606f891, 0x4630b116,
        0x8df0e8bd, 0x46422310, 0x46204629, 0xf86cf000, 0xb10e4606, 0xe7f34630, 0x0008eb05, 0x68e01e47,
        0xf1f0fbb7, 0x7011fb00, 0x68e0b140, 0xf0f0fbb7, 0x0b01f100, 0xfb0068e0, 0x1e47f00b, 0x480be011,
        0x68004478, 0x20096005, 0x71c84909, 0xffacf7ff, 0x69a04606, 0x69a0b108, 0xb1064780, 0x68e0e003,
        0x42bd4405, 0xbf00d9eb, 0xe7c94630, 0x000002ec, 0x40020000, 0x4604b570, 0x4628460d, 0xf84ef000,
        0xb10e4606, 0xbd704630, 0x2004b90c, 0x2044e7fb, 0x71c84902, 0xff88f7ff, 0x0000e7f5, 0x40020000,
        0xb9094601, 0x47702004, 0x6cc04826, 0x6003f3c0, 0x447b4b25, 0x0010f833, 0xb90a0302, 0xe7f22064,
        0x60082000, 0x2002604a, 0x02c06088, 0x200060c8, 0x61486108, 0xbf006188, 0x4602e7e5, 0x2004b90a,
        0x61914770, 0xe7fb2000, 0x4604b530, 0x2004b90c, 0x1e58bd30, 0xb9104008, 0x40101e58, 0x2065b108,
        0x6820e7f6, 0xd8054288, 0x0500e9d4, 0x188d4428, 0xd20142a8, 0xe7eb2066, 0xe7e92000, 0x480b4601,
        0xd0014281, 0x4770206b, 0xe7fc2000, 0xb90b4603, 0x47702004, 0xd801290f, 0xd0012a04, 0xe7f82004,
        0xe7f62000, 0x40048000, 0x0000025a, 0x6b65666b, 0x41f0e92d, 0x46884607, 0x461d4614, 0x2004b914,
        0x81f0e8bd, 0x462a2308, 0x46384641, 0xffbcf7ff, 0xb10e4606, 0xe7f34630, 0x4812e01f, 0x68004478,
        0x8000f8c0, 0x490fcc01, 0x390c4479, 0x60486809, 0x490ccc01, 0x39184479, 0x60886809, 0x490a2007,
        0xf7ff71c8, 0x4606ff01, 0xb10869b8, 0x478069b8, 0xe004b106, 0x0808f108, 0x2d003d08, 0xbf00d1dd,
        0xe7cd4630, 0x000001b0, 0x40020000, 0x4dffe92d, 0x4682b082, 0x2310460c, 0x46504621, 0xf7ff9a04,
        0x4683ff83, 0x0f00f1bb, 0x4658d003, 0xe8bdb006, 0xe9da8df0, 0xfbb00101, 0x4260f7f1, 0x40084279,
        0x42a54245, 0x443dd100, 0xe0229e04, 0x0804eba5, 0xd90045b0, 0xea4f46b0, 0x90011018, 0x4478480f,
        0x60046800, 0x490e2001, 0x980171c8, 0x72c80a00, 0x72889801, 0x72489805, 0xfeb6f7ff, 0xf1bb4683,
        0xd0010f00, 0xe7d14658, 0x0608eba6, 0x443d4444, 0x2e00bf00, 0x2000d1da, 0x0000e7c8, 0x0000010e,
        0x40020000, 0x4604b570, 0xb90c460d, 0xbd702004, 0x49032040, 0x460871c8, 0xf7ff7185, 0xe7f6fe95,
        0x40020000, 0x4dffe92d, 0x4617460c, 0xe9dd461d, 0xf8ddb80c, 0xb91da038, 0xb0042004, 0x8df0e8bd,
        0x463a2304, 0x98004621, 0xff1ef7ff, 0xb10e4606, 0xe7f24630, 0x4814e022, 0x68004478, 0x20026004,
        0x71c84912, 0xf8804608, 0x490fb00b, 0x39144479, 0x68096828, 0xf7ff6088, 0x4606fe67, 0xf1b8b15e,
        0xd0010f00, 0x4000f8c8, 0x0f00f1ba, 0x2000d002, 0x0000f8ca, 0x1f3fe004, 0x1d241d2d, 0xd1da2f00,
        0x4630bf00, 0x0000e7c9, 0x00000074, 0x40020000, 0x00000000, 0x00080000, 0x00100000, 0x00200000,
        0x00400000, 0x00800000, 0x01000000, 0x01000000, 0x40020004, 0x00000000,
    ],
    load_address : 0x20000000,
    minProgramLength: 8,
    pageBuffers : [0x20003000, 0x20004000],
    pcEraseAll : 0x20000059,
    pcEraseSector : 0x2000007d,
    pcInit : 0x20000021,
    pcProgramPage : 0x200000ab,
    staticBase : 0x20000000 + 0x20 + 0x474,
};

export class K64F extends CortexM {
    private flashAlgo: IFlashAlgo;

    constructor(device: Device) {
        super(device);

        this.flashAlgo = K64FFlashAlgo;
    }

    /**
     * Initialise the flash driver on the chip. Must be called before any of the other
     * flash-related methods.
     *
     * TODO: check that this has been called before calling other flash methods.
     */
    public async flashInit() {
        await this.halt();
        await this.writeCoreRegister(CortexReg.R9, this.flashAlgo.staticBase);

        const result = await this.runCode(
            this.flashAlgo.code,
            this.flashAlgo.load_address,
            this.flashAlgo.pcInit,
            this.flashAlgo.beginStack,
            this.flashAlgo.load_address - 1,
        );

        if (result !== 0) {
            throw new Error("Invalid result code running flash init.");
        }
    }

    /**
     * Upload a binary blob to (non-volatile) flash memory, at the specified address. Uses the
     * flashing algorithm relevant to the particular part - if you just want to upload to RAM,
     * use this.writeBlock.
     *
     * @param code an array of 32-bit words representing the binary data to be uploaded.
     * @param address starting address of the location in memory to upload to.
     */
    public async flash(code: number[], address = 0x0) {
        throw new Error("Not implemented.");
    }

    /**
     * Erase ALL data stored in flash on the chip.
     */
    public async eraseChip() {
        const result = await this.runCode(
            this.flashAlgo.code,
            this.flashAlgo.load_address,
            this.flashAlgo.pcEraseAll,
            this.flashAlgo.beginStack,
            this.flashAlgo.load_address - 1,
        );
        const finalPC = await this.readCoreRegister(CortexReg.PC);

        console.log(result, finalPC.toString(16));
        return result;
    }

    /**
     * Run specified machine code natively on the device. Assumes usual C calling conventions
     * - returns the value of r0 once the program has terminated. The program _must_ terminate
     * in order for this function to return. This can be achieved by placing a `bkpt`
     * instruction at the end of the function.
     *
     * FIXME: currently causes a hard fault when the core is resumed after successfully uploading
     * the blob to memory and setting core registers.
     *
     * @param code array containing the machine code (32-bit words).
     * @param address memory address at which to place the code.
     * @param pc initial value of the program counter.
     * @param sp initial value of the stack pointer.
     * @param lr initial value of the link register.
     *
     * @returns A promise for the value of r0 on completion of the function call.
     */
    private async runCode(code: number[], address: number,  pc: number, sp: number, lr: number) {
        // upload flashing algorithm to flashAlgo.load_address
        await this.halt();

        // write the flash algorithm to memory
        await this.writeBlock(this.flashAlgo.load_address, this.flashAlgo.code);

        // write registers
        await this.writeCoreRegister(CortexReg.PC, pc);
        await this.writeCoreRegister(CortexReg.LR, lr);
        await this.writeCoreRegister(CortexReg.SP, sp);

        // resume core
        // await this.resume();

        while (await this.getState() === CoreState.TARGET_RUNNING) { /* empty */ }

        return await this.readCoreRegister(CortexReg.R0);
    }
}