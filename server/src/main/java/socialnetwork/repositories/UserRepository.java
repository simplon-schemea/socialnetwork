package socialnetwork.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import socialnetwork.entities.UserEntity;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
    Optional<UserEntity> findByMail(String mail);
}
