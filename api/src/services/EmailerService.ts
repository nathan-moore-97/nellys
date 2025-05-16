
interface IEmailerService {
    send(dest: string, body: string): Promise<boolean>;
}

export class EmailerService implements IEmailerService {
    async send(dest: string, body: string): Promise<boolean> {
        console.log(`${dest} => ${body}`);
        return true;
    }
}



