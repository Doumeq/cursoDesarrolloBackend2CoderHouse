import TicketModel from "../dao/models/ticketModel.js";

export default class TicketRepository {
    constructor() {
        this.dao = TicketModel;
    }

    async createTicket(ticketData) {
        return await this.dao.create(ticketData);
    }
}