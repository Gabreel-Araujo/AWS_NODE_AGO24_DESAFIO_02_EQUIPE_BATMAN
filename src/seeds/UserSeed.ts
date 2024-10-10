import bcrypt from 'bcryptjs';
import User from '@/modules/users/typeorm/entities/User';
import { DataSource } from 'typeorm';

export const UserSeed = async (dataSource: DataSource) => {
	const userRepository = dataSource.getRepository(User);

	const existingUser = await userRepository.findOneBy({
		email: 'admin@example.com',
	});

	const newUser = {
		fullName: 'Admin User',
		email: 'admin@example.com',
		password: 'senha123',
	};

	if (!existingUser) {
		const user = userRepository.create(newUser);

		user.password = await bcrypt.hash(newUser.password, 8);

		await userRepository.save(user);
		console.log('Usuário admin criado com sucesso!');
	} else {
		console.log('Usuário admin já existe.');
	}
};
