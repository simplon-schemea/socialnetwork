package socialnetwork.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import socialnetwork.entities.RoleEntity;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<RoleEntity, UUID> {
    Optional<RoleEntity> findByName(String name);
}
