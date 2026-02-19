export default class UserDTO {
    constructor(user) {
        const data = user.user || user; 
        
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.age = data.age;
        this.role = data.role;
        this.cart = data.cart;

        this.full_name = `${data.first_name} ${data.last_name}`;
    }
}